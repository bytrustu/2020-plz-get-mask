const axios = require('axios');
const cheerio = require('cheerio');
var db_ 	= require("./../custom_module/db_query.js");

function send(res, code, data) {
	if (!data) data = {};
	res.statusCode = code;
	res.send(data);
}

const getMaskList = callback => {
	// const urls = [
	// 	{
	// 		name : '주전자',
	// 		url : 'https://smartstore.naver.com/domokor/products/4021662508',
	// 		etc : 'naver-store'
	// 	},
	// 	{
	// 		name : '신발',
	// 		url : 'https://shopping.naver.com/outlet/stores/100564320/products/4799328086',
	// 		etc : 'naver-store'
	// 	},
	// 	{
	// 		name : '신발일까',
	// 		url : 'https://shopping.naver.com/outlet/stores/1000020909/products/4781366378',
	// 		etc : 'naver-store'
	// 	},
	// 	{
	// 		name : '상공양행 KF94 나인포 게릴라',
	// 		url : 'https://smartstore.naver.com/sangkong/products/4762917002',
	// 		etc : 'naver-store'
	// 	},
	// 	{
	// 		name : '아에르 KF94 스탠다드 베이직',
	// 		url : 'https://smartstore.naver.com/aer-shop/products/4722827602',
	// 		etc : 'naver-store'
	// 	},
	// 	{
	// 		name : '국대 KF94 미세먼지',
	// 		url : 'https://smartstore.naver.com/korea-mask/products/4825762296',
	// 		etc : 'naver-store'
	// 	},
	// 	{
	// 		name : '닥터퓨리 KF94 미세먼지',
	// 		url : 'https://smartstore.naver.com/mfbshop/products/4072573492',
	// 		etc : 'naver-store'
	// 	},
	// 	{
	// 		name : '에티카 KF94 미세먼지',
	// 		url : 'https://smartstore.naver.com/etiqa/products/4817982860',
	// 		etc : 'naver-store'
	// 	},
	// 	{
	// 		name : '네퓨어 KF94 미세먼지 끈길이조절',
	// 		url : 'https://smartstore.naver.com/gonggami/products/4705579501',
	// 		etc : 'naver-store'
	// 	}
	// ];
	db_.getMaskUrl(urls => {
		const arr = urls.map(v => {return {...v}});
		callback(arr);
	})

};

module.exports.initMaskList = () => {
	db_.initMaskUrl(urls, data => {
	});
};



const getServerStatus = async (callback) => {
	db_.getServerStatus(result => {
		callback(result)
	});
};

module.exports.serverStatus = (req, res) => {
	getServerStatus((server) => {
		send(res, 200, server);
	});
}

module.exports.workingCrawling = () => {
	getServerStatus((server) => {
		if (server.power == 1) {

			getMaskList(urls => {

				const getHtml = async (url) => {
					try {
						return await axios.get(url);
					} catch (error) {
					}
				};
				const plzGetMask = (urls) => {
					const data = urls.map(info => {
						const {name, url, etc} = info;
						return getHtml(url).then(html => {
							try {
								const $ = cheerio.load(html.data);
								const payEl = $('.not_goods > p > em');
								const payText = payEl.text();
								if (payText === '구매하실 수 없는') {
									return;
									// return {state: 'false', ...info};
								} else {
									return info;
								}
							} catch (e) {
								return;
								// return {state: 'error', ...info};
							}
						})
					});

					// db_.deleteMaskList(success => {
					//
					// });


					Promise.all(data).then(v => {
						let items = v.filter(v => v);
						if (items.length == 0) {
							return;
						}
						db_.updateMaskList(items, data => {
						});
						// const sucFilter = v.filter(info => info.state === 'success');
						// if (sucFilter.length == 0) {
						// 	send(res, 200, {state:false});
						// } else {
						// 	const data = sucFilter.map(item => {
						// 		const {name, url} = item;
						// 		return {name : name, url : url};
						// 	})
						// 	send(res, 200, {state:true, data : data});
						// }
					})
				}
				plzGetMask(urls);
			});
		}
	})
}



module.exports.plz_get_mask = (req, res) => {
	db_.getMaskList(data => {
		send(res, 200, data);
	})
};

module.exports.get_mask_list = async (req, res) => {
	getMaskList(urls => {
		send(res, 200, urls);
	})
};
