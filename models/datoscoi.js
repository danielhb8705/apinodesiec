var Firebird = require('node-firebird');
var moment = require('moment');
var options = {};
/*==========================================*/
// Opciones para conectarse a la BD
/*==========================================*/
options.host = '127.0.0.1';
options.port = 3050;
options.database = 'C:\\COI80EMPRE6.FDB';
options.user = 'SYSDBA';
options.password = 'masterkey';
options.lowercase_keys = false; // set to true to lowercase keys
options.role = null;            // default
options.pageSize = 4096;        // default when creating databaSE

var datosCOI = {};

datosCOI.getDepartamentos = function(){
   return new Promise((resolve,reject) => {
		
        Firebird.attach(options, function(err, db) {
          if (err)
                reject(err)
            // db = DATABASE
            db.query('SELECT * FROM DEPTOS', function(err, result) { 
                if(err)
                    reject(err);
                console.log(JSON.stringify(result));
                // IMPORTANT: close the connection
                db.detach();
                resolve(result);
            });         
        });
    });
	
}
//Obtener datos de las cuentas por departamentos
datosCOI.getDatosCuentasXDpto = function(mes,anhio){
	  return new Promise((resolve,reject) => {
		
        Firebird.attach(options, function(err, db) {
          if (err){
                reject(err);
				console.log(err);
		  }	
		  console.log("1- "+mes+" 2- "+anhio);
		  var ch = 'S';
			var sel = 'SELECT T1.NUM_CTA AS NUMCUENTA,T1.NOMBRE AS NAMECUENTA,T1.DEPTSINO,T1.TIPO,T3.DESCRIP AS NAMEDPTO,T2.EJERCICIO,T2.DEPTO,';
			var saldo_inicial='';
			var total_cargos='';
			var total_abonos='';
			var saldo_final = '';
			var from_where = " FROM CUENTAS19 AS T1 INNER JOIN SALDOSDP19 AS T2 ON T1.NUM_CTA = T2.NUM_CTA INNER JOIN DEPTOS AS T3 ON T2.DEPTO = T3.DEPTO WHERE T1.DEPTSINO = 'S' ORDER BY T2.DEPTO,T1.NUM_CTA ASC";
			//
			var sql ='';
			switch(mes){
				case 0:
					saldo_inicial = 'T2.INICIAL AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO01 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO01 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01-T2.ABONO01) AS SALDOFINAL';
					break;
				case 1:
					saldo_inicial = '(T2.INICIAL+T2.CARGO01-T2.ABONO01) AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO02 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO02 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01+T2.CARGO02-T2.ABONO01-T2.ABONO02) AS SALDOFINAL';
					break;
				case 2:
					saldo_inicial = '(T2.INICIAL+T2.CARGO01+T2.CARGO02-T2.ABONO01-T2.ABONO02) AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO03 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO03 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03-T2.ABONO01-T2.ABONO02-T2.ABONO03) AS SALDOFINAL';
					break;
				case 3:
					saldo_inicial = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03-T2.ABONO01-T2.ABONO02-T2.ABONO03) AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO04 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO04 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04) AS SALDOFINAL';
					break;
				case 4:
					saldo_inicial = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04) AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO05 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO05 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05) AS SALDOFINAL';
					break;
				case 5:
					saldo_inicial = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05) AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO06 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO06 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06) AS SALDOFINAL';
					break;
				case 6:
					saldo_inicial = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06) AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO07 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO07 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06+T2.CARGO07-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06-T2.ABONO07) AS SALDOFINAL';
					break;
				case 7:
					saldo_inicial = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06+T2.CARGO07-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06-T2.ABONO07) AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO08 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO08 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06+T2.CARGO07+T2.CARGO08-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06-T2.ABONO07-T2.ABONO08) AS SALDOFINAL';
					break;
				case 8:
					saldo_inicial = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06+T2.CARGO07+T2.CARGO08-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06-T2.ABONO07-T2.ABONO08) AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO09 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO09 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06+T2.CARGO07+T2.CARGO08+T2.CARGO09-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06-T2.ABONO07-T2.ABONO08-T2.ABONO09) AS SALDOFINAL';
					break;
				case 9:
					saldo_inicial = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06+T2.CARGO07+T2.CARGO08+T2.CARGO09-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06-T2.ABONO07-T2.ABONO08-T2.ABONO09) AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO10 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO10 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06+T2.CARGO07+T2.CARGO08+T2.CARGO09+T2.CARGO10-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06-T2.ABONO07-T2.ABONO08-T2.ABONO09-T2.ABONO10) AS SALDOFINAL';
					break;
				case 10:
					saldo_inicial = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06+T2.CARGO07+T2.CARGO08+T2.CARGO09+T2.CARGO10-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06-T2.ABONO07-T2.ABONO08-T2.ABONO09-T2.ABONO10) AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO11 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO11 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06+T2.CARGO07+T2.CARGO08+T2.CARGO09+T2.CARGO10+T2.CARGO11-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06-T2.ABONO07-T2.ABONO08-T2.ABONO09-T2.ABONO10-T2.ABONO11) AS SALDOFINAL';
					break;
				case 11:
					saldo_inicial = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06+T2.CARGO07+T2.CARGO08+T2.CARGO09+T2.CARGO10+T2.CARGO11-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06-T2.ABONO07-T2.ABONO08-T2.ABONO09-T2.ABONO10-T2.ABONO11) AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO12 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO12 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06+T2.CARGO07+T2.CARGO08+T2.CARGO09+T2.CARGO10+T2.CARGO11+T2.CARGO12-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06-T2.ABONO07-T2.ABONO08-T2.ABONO09-T2.ABONO10-T2.ABONO11-T2.ABONO12) AS SALDOFINAL';
					break;		
			}
			sql = sel+saldo_inicial+total_cargos+total_abonos+saldo_final+from_where;
			console.log("1- "+mes+" 2- "+anhio+" sql- "+sql);
            // db = DATABASE
			   db.query(sql, function(err, result) { 
					if(err){
						reject(err);
						console.log(err);
					}	
					//console.log(JSON.stringify(result));
					// IMPORTANT: close the connection
					db.detach();
					resolve(result);
					
				}); 
				
        });
    });
}
//Obtener datos de todas las cuentas 
datosCOI.getDatosCuentas = function(mes,anhio){
	//console.log("1- "+ mes+ "2- " +anhio);
	  return new Promise((resolve,reject) => {
		
        Firebird.attach(options, function(err, db) {
          if (err){
                reject(err);
				console.log(err);
		  }	
            // db = DATABASE
			var sel = 'SELECT T1.NUM_CTA AS NUMCUENTA,T1.NOMBRE AS NAMECUENTA,T1.DEPTSINO,T2.EJERCICIO,T1.TIPO,';
			var saldo_inicial='';
			var total_cargos='';
			var total_abonos='';
			var saldo_final = '';
			var from_where = '  FROM CUENTAS19 AS T1 INNER JOIN SALDOS19 AS T2 ON T1.NUM_CTA = T2.NUM_CTA ORDER BY NUMCUENTA ASC';
			var sql ='';
			switch(mes){
				case 0:
					saldo_inicial = 'T2.INICIAL AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO01 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO01 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01-T2.ABONO01) AS SALDOFINAL';
					break;
				case 1:
					saldo_inicial = '(T2.INICIAL+T2.CARGO01-T2.ABONO01) AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO02 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO02 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01+T2.CARGO02-T2.ABONO01-T2.ABONO02) AS SALDOFINAL';
					break;
				case 2:
					saldo_inicial = '(T2.INICIAL+T2.CARGO01+T2.CARGO02-T2.ABONO01-T2.ABONO02) AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO03 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO03 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03-T2.ABONO01-T2.ABONO02-T2.ABONO03) AS SALDOFINAL';
					break;
				case 3:
					saldo_inicial = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03-T2.ABONO01-T2.ABONO02-T2.ABONO03) AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO04 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO04 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04) AS SALDOFINAL';
					break;
				case 4:
					saldo_inicial = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04) AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO05 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO05 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05) AS SALDOFINAL';
					break;
				case 5:
					saldo_inicial = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05) AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO06 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO06 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06) AS SALDOFINAL';
					break;
				case 6:
					saldo_inicial = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06) AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO07 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO07 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06+T2.CARGO07-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06-T2.ABONO07) AS SALDOFINAL';
					break;
				case 7:
					saldo_inicial = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06+T2.CARGO07-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06-T2.ABONO07) AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO08 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO08 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06+T2.CARGO07+T2.CARGO08-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06-T2.ABONO07-T2.ABONO08) AS SALDOFINAL';
					break;
				case 8:
					saldo_inicial = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06+T2.CARGO07+T2.CARGO08-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06-T2.ABONO07-T2.ABONO08) AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO09 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO09 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06+T2.CARGO07+T2.CARGO08+T2.CARGO09-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06-T2.ABONO07-T2.ABONO08-T2.ABONO09) AS SALDOFINAL';
					break;
				case 9:
					saldo_inicial = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06+T2.CARGO07+T2.CARGO08+T2.CARGO09-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06-T2.ABONO07-T2.ABONO08-T2.ABONO09) AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO10 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO10 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06+T2.CARGO07+T2.CARGO08+T2.CARGO09+T2.CARGO10-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06-T2.ABONO07-T2.ABONO08-T2.ABONO09-T2.ABONO10) AS SALDOFINAL';
					break;
				case 10:
					saldo_inicial = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06+T2.CARGO07+T2.CARGO08+T2.CARGO09+T2.CARGO10-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06-T2.ABONO07-T2.ABONO08-T2.ABONO09-T2.ABONO10) AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO11 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO11 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06+T2.CARGO07+T2.CARGO08+T2.CARGO09+T2.CARGO10+T2.CARGO11-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06-T2.ABONO07-T2.ABONO08-T2.ABONO09-T2.ABONO10-T2.ABONO11) AS SALDOFINAL';
					break;
				case 11:
					saldo_inicial = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06+T2.CARGO07+T2.CARGO08+T2.CARGO09+T2.CARGO10+T2.CARGO11-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06-T2.ABONO07-T2.ABONO08-T2.ABONO09-T2.ABONO10-T2.ABONO11) AS SALDOINICIAL,';
					total_cargos = 'T2.CARGO12 AS TOTALCARGOS,';
					total_abonos = 'T2.ABONO12 AS TOTALABONOS,';
					saldo_final = '(T2.INICIAL+T2.CARGO01+T2.CARGO02+T2.CARGO03+T2.CARGO04+T2.CARGO05+T2.CARGO06+T2.CARGO07+T2.CARGO08+T2.CARGO09+T2.CARGO10+T2.CARGO11+T2.CARGO12-T2.ABONO01-T2.ABONO02-T2.ABONO03-T2.ABONO04-T2.ABONO05-T2.ABONO06-T2.ABONO07-T2.ABONO08-T2.ABONO09-T2.ABONO10-T2.ABONO11-T2.ABONO12) AS SALDOFINAL';
					break;		
			}
			sql = sel+saldo_inicial+total_cargos+total_abonos+saldo_final+from_where;
			//console.log(sql);
			   db.query(sql, function(err, result) { 
					if(err){
						reject(err);
						console.log(err);
					}	
					//console.log(JSON.stringify(result));
					// IMPORTANT: close the connection
					db.detach();
					resolve(result);
					
				}); 
				
        });
    });
}
/*
userModel.createUser = function(userInfo){
    const username = userInfo.username;
    const password = userInfo.password;
    var displayName = userInfo.displayName;
    var token = userInfo.token;
    if(!displayName){
        displayName = '';
    }
    if(!token){
        token = '';
    }
    return new Promise((resolve,reject) => {
        try {
            if(con){
                // Create hash
                
                const hashedPassword =
                crypto.createHash('sha256')
                .update(password)
                .digest('hex');
                
               //var hashedPassword = bcrypt.hashSync(password, 8);
    
                const sql = "insert into users (username,password,displayName,token) values (" + 
                con.escape(username) + ",'" + hashedPassword + "'," + con.escape(displayName) + "," 
                + con.escape(token) + ")";
                con.query(sql, function (error, result) {
                    if (error) {
                        if(error.code === 'ER_DUP_ENTRY'){
                            reject({
                                result: false,
                                data: 'The username already exists'
                            });
                        } else {
                            reject({
                                result: false,
                                data: error
                            });
                        }                        
                    } else {
                        // create a token
                        const user_id = result.insertId;
                        var token = jwt.sign({ id: user_id }, 
                            process.env.APP_SECRET, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        const info = {
                            displayName: displayName
                        }
                        resolve({
                            result: true,
                            token: token,
                            data: info
                        });
                    }   
                });
            }
        }
        catch(error) {
            console.error(error);
            reject({
                result: false,
                data: error
            });
        }
    });
        
}

userModel.getUser = function(user_id){
    return new Promise((resolve,reject) => {
        try {
            if(con){
    
                const sql = "select user_id,username,token,displayName from users where user_id = " + con.escape(user_id);
                con.query(sql, function (err, result) {
                    if (err) {
                        reject({
                            result: false,
                            data: error
                        });
                    } else {
                        if(result[0]){
                            const info = {
                                id: result[0]["user_id"],
                                token: result[0]["token"],
                                displayName: result[0]["displayName"]
                            }
                            resolve({
                                result: true,
                                data: info
                            });
                        } else {
                            resolve({
                                result: false,
                                data: 'No user found'
                            });
                        }
                    }   
                });
            }
          }
        catch(error) {
            console.error(error);
            reject({
                result: false,
                data: error
            });
        }
    });
}
userModel.login = function(username, password){
    return new Promise((resolve,reject) => {
        try {
            if(con){
                // Create hash
                
                const hashedPassword =
                crypto.createHash('sha256')
                .update(password)
                .digest('hex');
                
               //var hashedPassword = bcrypt.hashSync(password, 8);
    
                const sql = "select user_id,username,password,token,displayName from users where username = " + con.escape(username);
                con.query(sql, function (error, result) {
                    if (error) {
                        if(error.code === "ECONNREFUSED"){
                            reject({
                                result: false,
                                data: 'No database service'
                            }); 
                        } else {
                            reject({
                                result: false,
                                data: error
                            });
                        }
                    } else {
                        if(result[0]){
                            var passwordIsValid = false;
                            if(hashedPassword === result[0]["password"]){
                                passwordIsValid = true;
                            }
                            //var passwordIsValid = bcrypt.compareSync(hashedPassword, result[0]['password']);
                            if (!passwordIsValid){
                                resolve({
                                    result: false,
                                    token: null,
                                    data: 'Wrong password'
                                });
                            }
                            // create a token
                            const user_id = result[0]["user_id"];
                            const token = jwt.sign({ id: user_id}, 
                                process.env.APP_SECRET, 
                                {expiresIn: 86400}
                            );
                            const info = {
                                displayName: result[0]["displayName"]
                            }
                            resolve({
                                result: true,
                                token: token,
                                data: info
                            });
                        } else {
                            resolve({
                                result: false,
                                token: null,
                                data: 'No user found'
                            });
                        }
                    }   
                });
            }
          }
        catch(error) {
            console.error(error);
            reject({
                result: false,
                data: error
            });
        }
    });
}
userModel.loginSmartsheet = function(email){
    return new Promise((resolve,reject) => {
        try {
            if(con){    
                const sql = "select user_id,username,token,displayName from users where username = " + con.escape(email);
                con.query(sql, function (error, result) {
                    if (error) {
                        if(error.code === "ECONNREFUSED"){
                            reject({
                                result: false,
                                data: 'No database service'
                            }); 
                        } else {
                            reject({
                                result: false,
                                data: error
                            });
                        }
                    } else {
                        if(result[0]){
                            var userIsValid = false;
                            if(email === result[0]["username"]){
                                userIsValid = true;
                            }
                            //var passwordIsValid = bcrypt.compareSync(hashedPassword, result[0]['password']);
                            if (!userIsValid){
                                resolve({
                                    result: false,
                                    token: null,
                                    data: 'Wrong user'
                                });
                            }
                            // create a token
                            const user_id = result[0]["user_id"];
                            const token = jwt.sign({ id: user_id}, 
                                process.env.APP_SECRET, 
                                {expiresIn: 86400}
                            );
                            const info = {
                                user_id: user_id,
                                displayName: result[0]["displayName"]
                            }
                            resolve({
                                result: true,
                                token: token,
                                data: info
                            });
                        } else {
                            resolve({
                                result: false,
                                token: null,
                                data: 'No user found'
                            });
                        }
                    }   
                });
            }
          }
        catch(error) {
            console.error(error);
            reject({
                result: false,
                data: error
            });
        }
    });
}
userModel.createAccess = function(user_id,access) {
    return new Promise((resolve,reject) => {
        try {
            if(con){    
                const sql = "update users set access = " + con.escape(access) + "where user_id = " + con.escape(user_id);
                con.query(sql, function (err, result) {
                    if (err) {
                        reject({
                            result: false,
                            data: error
                        });
                    } else {
                        resolve({
                            result: true,
                            data: result
                        });
                    }   
                });
            }
          }
        catch(error) {
            console.error(error);
            reject({
                result: false,
                data: error
            });
        }
    });
}
userModel.verifyAccess = function(access) {
    return new Promise((resolve,reject) => {
        try {
            if(con){
                const sql = "select user_id,username,password,token,displayName from users where access = " + con.escape(access);
                con.query(sql, function (error, result) {
                    if (error) {
                        if(error.code === "ECONNREFUSED"){
                            reject({
                                result: false,
                                data: 'No database service'
                            }); 
                        } else {
                            reject({
                                result: false,
                                data: error
                            });
                        }
                    } else {
                        if(result[0]){   
                            const sql = "update users set access = '' where user_id = " + con.escape(result[0]["user_id"]);
                            con.query(sql, function (error1, result1) {
                                if (error) {
                                    if(error.code === "ECONNREFUSED"){
                                        reject({
                                            result: false,
                                            data: 'No database service'
                                        }); 
                                    } else {
                                        reject({
                                            result: false,
                                            data: error
                                        });
                                    }
                                } else {
                                    // create a token
                                    const user_id = result[0]["user_id"];
                                    const token = jwt.sign({ id: user_id}, 
                                        process.env.APP_SECRET, 
                                        {expiresIn: 86400}
                                    );
                                    const info = {
                                        displayName: result[0]["displayName"]
                                    }
                                    resolve({
                                        result: true,
                                        token: token,
                                        data: info
                                    });
                                }
                            });
                        } else {
                            resolve({
                                result: false,
                                token: null,
                                data: 'No user found'
                            });
                        }
                    }   
                });
            }
          }
        catch(error) {
            console.error(error);
            reject({
                result: false,
                data: error
            });
        }
    });
}
*/
module.exports = datosCOI;