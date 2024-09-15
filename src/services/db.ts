import Knex from 'knex';
import config from '../../knexfile';

// Initialize Knex with the configuration
const knex = Knex(config);

export default knex;
