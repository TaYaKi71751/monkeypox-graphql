import { gql } from 'apollo-server-micro'

export const schema = gql`
type Result {
	confirmed: Int
	suspected: Int
	discarded: Int
	omit_error: Int
}

type Query {
	cumulative(Country: String): Result
}
`

export default schema
