'use strict';

require('../test/test.js')(async ({ build, 龙腾道, get }) => {
	
	const zhs = `模仿 Promise API 的同步防爆栈工具。从属于“简计划”。`;
	const en = `Sync stack anti-overflow util which's API is like Promise. Belong to "Plan J".`;
	
	await build({
		name: 'j-thenable',
		user: 'LongTengDao@ltd',
		Desc: [ zhs, en ],
		Auth: 龙腾道,
		Copy: 'LGPL-3.0',
		semver: await get('src/version'),
		ES: 3,
		ESM: true,
		NPM: { description: `${en}／${zhs}` },
		UMD: { main_global: 'Thenable' },
		LICENSE_: true,
	});
	
});
