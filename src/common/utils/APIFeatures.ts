import { Query } from 'mongoose';

class ApiFeatures<T> {
  private query: Query<T[], T>;
  private queryString: Record<string, any>;

  constructor(query: Query<T[], T>, queryString: Record<string, any>) {
    this.queryString = queryString;
    this.query = query;
  }

  filter(): this {
    const queryObj = { ...this.queryString };
    const excFields = ['page', 'sort', 'limit', 'fields'];
    excFields.forEach((field) => delete queryObj[field]);
    Object.keys(queryObj).forEach((key) => {
      const match = key.match(/^(\w+)\[(gte|gt|lte|lt)\]$/);
      if (match) {
        const [, field, operator] = match;
        queryObj[field] = { [`$${operator}`]: Number(queryObj[key]) };
        delete queryObj[key];
      } else if (!isNaN(queryObj[key])) {
        queryObj[key] = Number(queryObj[key]);
      }
    });

    this.query = this.query.find(queryObj);

    return this;
  }

  sort(): this {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields(): this {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate(): this {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  async exec() {
    return await this.query;
  }
}

export default ApiFeatures;
