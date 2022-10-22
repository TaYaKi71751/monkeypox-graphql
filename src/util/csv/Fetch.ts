import http from 'http';
import https from 'https';
import { Firefox } from '@corcc/useragent';
import { split as splitRow } from './Row';

const NULL = null;

export async function fetch (
	urlString:string,
	parseFn: (title:Buffer, current:Buffer) => void
) {
	const userAgent = await Firefox.userAgent();
	const url = new URL(urlString);
	const host = url?.host;
	const hostname = url?.hostname;
	const port = url?.port;
	const protocol = url?.protocol;
	const path = url?.pathname;
	let h:any = NULL;
	switch (protocol) {
	case 'http:': h = http; break;
	case 'https:': h = https; break;
	default: throw new Error(`Unsupported protocol : ${protocol}`);
	}
	return await new Promise((resolve, reject) => {
		const req = h.request({
			host: hostname,
			port,
			path,
			headers: {
				Accept: '*',
				Host: host,
				'User-Agent': userAgent
			}
		}, (res:any) => {
			res.setEncoding('utf8');
			const buf:Array<number> = [];
			let titleComplete = false;
			let title:Array<number> = [];
			let current:Array<number> = [];
			res.on('data', (chunk:Buffer) => {
				for (let i = 0; i < chunk.length; i++) {
					if (`${chunk[i]}` == '\n') {
						switch (Number(titleComplete)) {
						case 0:
							title = buf.slice(0, buf?.length);
							title = title.map((x:any) => x.charCodeAt());
							while (buf?.length) buf.pop();
							titleComplete = true;
							break;
						case 1:
							current = buf.slice(0, buf?.length);
							current = current.map((x:any) => x.charCodeAt());
							parseFn(Buffer.from(title), Buffer.from(current));
							while (buf?.length) buf.pop();
							break;
						default:
							throw new Error('');
						}
					} else {
						if (`${chunk[i]}` != '\r') buf.push(chunk[i]);
					}
				}
			});
			res.on('end', () => {
				current = buf;
				if (current?.length) parseFn(Buffer.from(title), Buffer.from(current));
				resolve(true);
			});
		});
		req.on('error', (error:any) => {
			console.error(error);
			reject(error);
		});
		req.end();
	});
}
