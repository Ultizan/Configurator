'use strict';

var xlsx = require('xlsx');

var DIR = './xlsFiles',
	BAC = 'Bulk Configurator.xlsm',
	PS = '/',
	CI_SHEET = 'ClassInstantiation',
	INIT = 0,
	BAC_WB,
	CI,
	BACMAP={},
	CI_INFO;

module.exports = {
	getBAC: function(ret,dataCallback,id){
		initBAC();
		ret = getBacAsset(id);
		//console.log(ret);
		dataCallback(ret);
	}	

}

function getBacAsset(id){
	var i,strCell,cell,rowNum,ret,strHeader,header;
	ret={};
	rowNum = BACMAP[id];
	if (typeof rowNum !== 'undefined'){
		for(i=1;i<CI_INFO.ecn;i++){
			strCell=toColumnName(i) + rowNum.toString();
			strHeader=toColumnName(i) + '1';
			cell = CI[strCell];
			header = CI[strHeader];
			//console.log(cell);
			if(typeof cell !== 'undefined'){
				ret[CI[strHeader].v]=cell.v
			}
		}
		return(ret);
	}else{
		ret = {
		};
		return(ret);
	}

}

function initBAC(){
	if(INIT === 0){
		var i = null,
			ec_num,
			cell,
			strCell,
			cellValue,
			keyCol;

		BAC_WB = xlsx.readFile(DIR + PS + BAC);
		CI = BAC_WB.Sheets[CI_SHEET];
		INIT = 1;
		CI_INFO = getWsInfo(CI);
		console.log(CI_INFO.er);
		ec_num = toColumnNumber(CI_INFO.ec);
		console.log(ec_num);
		for(i=1;i<ec_num;i++){
			strCell = toColumnName(i) + '1';
			cell = CI[strCell];
			if(typeof cell === 'undefined'){
				cellValue = '';
			}else{
				cellValue = cell.v
			}
			if(cellValue ==='CustomId'){
				keyCol = toColumnName(i);
				break;
			}
		}
		for(i=2;i<CI_INFO.er;i++){
			strCell = keyCol + i.toString()
			cellValue = CI[strCell].v
			BACMAP[cellValue] = i;
		}
	}
}


function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}

function datenum(v, date1904) {
	if(date1904) v+=1462;
	var epoch = Date.parse(v);
	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}
 
function sheet_from_array_of_arrays(data, opts) {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != data.length; ++R) {
		for(var C = 0; C != data[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell = {v: data[R][C] };
			if(cell.v == null) continue;
			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
			
			if(typeof cell.v === 'number') cell.t = 'n';
			else if(typeof cell.v === 'boolean') cell.t = 'b';
			else if(cell.v instanceof Date) {
				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			}
			else cell.t = 's';
			
			ws[cell_ref] = cell;
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
}

function to_json(worksheet) {
    var result = {};
    var roa = xlsx.utils.sheet_to_row_object_array(worksheet);
    if(roa.length > 0){
        result = roa;
    }
    return result;
}

function getWsInfo(ws){
	var range = ws['!ref'],
		s = range.split(':')[0],
		e = range.split(':')[1],
		sr =s.replace(/\D/g,''),
		er =e.replace(/\D/g,''),
		sc =s.replace(/\d/g,''),
		ec =e.replace(/\d/g,''),
		scn=toColumnNumber(sc),
		ecn=toColumnNumber(ec),
		info

	info={
		's':s,
		'e':e,
		'sr':sr,
		'er':er,
		'sc':sc,
		'ec':ec,
		'scn':scn,
		'ecn':ecn
	}
	return info;
}

function toColumnNumber(val) {
  var base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', i, j, result = 0;

  for (i = 0, j = val.length - 1; i < val.length; i += 1, j -= 1) {
    result += Math.pow(base.length, j) * (base.indexOf(val[i]) + 1);
  }
  return result;
};
function toColumnName(num) {
  for (var ret = '', a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
    ret = String.fromCharCode(parseInt((num % b) / a) + 65) + ret;
  }
  return ret;
}
