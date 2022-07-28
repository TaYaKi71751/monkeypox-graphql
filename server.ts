import { send } from 'micro';
import { default as typeDefs } from './schema'
const microCors:any = require('micro-cors')
import { get, post, router } from 'microrouter';
import { ApolloServer, gql } from 'apollo-server-micro';
import { makeExecutableSchema } from 'graphql-tools';
import fetch from 'node-fetch';

const resolvers = {
	Query: {
		async cumulative (_parent,{Country}, { getResults }) {
			const data = await getResults();
			const key = ['confirmed', 'suspected', 'discarded', 'omit_error'];
			let rtn = {
				confirmed: 0,
				suspected: 0,
				discarded: 0,
				omit_error: 0
			};
			const c = Country
			data.forEach((e:any) => {
				key.forEach((k) => {
					rtn[k] += (
						e.Status == k &&
								( !c || 
							 e.Country == c ||
								e.Country_ISO3 == c )
						) ? 1 : 0;
				});
			});
			return rtn;
		}
	}
};

const schema = makeExecutableSchema({
	typeDefs,
	resolvers
});
let results:any = null;

const server = new ApolloServer({
	schema,
	playground: true,
	introspection: true,
	context () {
		const getResults = async () => {
			if (results) {
				return results;
			}
			const res = await fetch('https://raw.githubusercontent.com/globaldothealth/monkeypox/main/latest.json');
			results = await res.json();
			return results;
		};
		return {
			getResults
		};
	}
});

const cors = microCors();

const handler = server.createHandler({ path: '/' });

export default cors((req, res) => req.method === 'OPTIONS' ? res.end() : handler(req, res));
