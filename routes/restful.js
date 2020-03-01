const axios = require('axios');
const cheerio = require('cheerio');
var db_ 	= require("./../custom_module/db_query.js");

function send(res, code, data) {
	if (!data) data = {};
	res.statusCode = code;
	res.send(data);
}

const getTestList = _ => {
	const urls = [
		{
			name : '상공양행 KF94 나인포 게릴라',
			url : 'https://smartstore.naver.com/sangkong/products/4762917002',
			etc : 'naver-store'
		},
		{
			name : '아에르 KF94 스탠다드 베이직',
			url : 'https://smartstore.naver.com/aer-shop/products/4722827602',
			etc : 'naver-store'
		},
		{
			name : '국대 KF94 미세먼지',
			url : 'https://smartstore.naver.com/korea-mask/products/4825762296',
			etc : 'naver-store'
		},
		{
			name : '닥터퓨리 KF94 미세먼지',
			url : 'https://smartstore.naver.com/mfbshop/products/4072573492',
			etc : 'naver-store'
		},
		{
			name : '에티카 KF94 미세먼지',
			url : 'https://smartstore.naver.com/etiqa/products/4817982860',
			etc : 'naver-store'
		},
		{
			name : '네퓨어 KF94 미세먼지 끈길이조절',
			url : 'https://smartstore.naver.com/gonggami/products/4705579501',
			etc : 'naver-store'
		}
	];
	return urls;
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
	const urls = getTestList();
	db_.initMaskUrl(urls, data => {
		console.log(data);
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
								const payEl = $('.not_goods > p');
								const payText = payEl.text();
								if (payText.indexOf('없는') == -1 || payText.indexOf('어렵') == -1) {
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
							db_.deleteMaskList(data => {
								return;
							});
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


module.exports.get_coopang_list = async (req, res) => {
	const getHtml = async (url) => {
		try {
			return await axios.get(url);
		} catch (error) {
		}
	};
	const url = `https://www.coupang.com/np/search?q=kf94+%EB%A7%88%EC%8A%A4%ED%81%AC+%EB%8C%80%ED%98%95&channel=user&component=&eventCategory=SRP&trcid=&traid=&sorter=scoreDesc&minPrice=&maxPrice=&priceRange=&filterType=rocket,&listSize=36&filter=&isPriceRange=false&brand=&offerCondition=&rating=0&page=1&rocketAll=false&searchIndexingToken=&backgroundColor=`;
	getHtml(url).then(html => {
		try {
			const $ = cheerio.load(html.data);
			const itemEl = $('.search-product');
			const itemArr = [];
			itemEl.each(function(i, elem) {
				const thisEl = $(this);
				const isSoldOut = thisEl.find('.out-of-stock').length;
				if (isSoldOut === 0) {
					const url =  `https://www.coupang.com`+ thisEl.find('.search-product-link').attr('href');
					itemArr.push(url);
				}
			});
			send(res, 200, itemArr);
		} catch (e) {
			send(res, 404, false);
		}
	})
};