'use strict';
let prevFiftyBlocks = []; //Previous 125 block times (when committed to blockchain)
let timeData = [];
let transData = [];
let storeBlock; //Latest block
let blockTime;
let chainHeight;
let blockNum; //Chain height/length
let sum = 0; //Sum of total time between blocks
let avg = 'N/A';
let startBlock;
let stdDev;
let minMax;
let timeDiff; //Time difference between two blocks
let scrollWidth;
let max;
let min;
let block1;
let prev;
let b;
let blk;
let payload;
let transSpans;
let data;
let date,date1;
$(document).ready(function(){
console.log('Loaded');
 $.ajax({
        type: 'GET',
        dataType : 'json',
        contentType: 'application/json',
        crossDomain:true,
        url: 'https://8f9fdaeef1e544829a398e3e20dc0bd9-vp0.us.blockchain.ibm.com:5003/chain',
        success: function(d) {
			console.log(d);
            chainHeight = d.height;
			console.log('Height'+chainHeight);
            blockNum = d.height - 1;
            console.log(blockNum);
        },
        error: function(e){
            console.log(e);
        },
        async: false
    });
	
	for(let i = 1; i < 126; i++)
        {
		
            if(blockNum - i > 0)
            {
                
				
                $.ajax({
                    type: 'GET',
                    dataType : 'json',
                    contentType: 'application/json',
                    crossDomain:true,
                    url: 'https://8f9fdaeef1e544829a398e3e20dc0bd9-vp0.us.blockchain.ibm.com:5003/chain/blocks/'+(blockNum-i),
                    success: function(d) {
						
                        blk = d.transactions[0];
						
						if(typeof blk != 'undefined'){
						console.log(d);
						console.log('Sumanth'+blk);
						blockTime= d.nonHashData.localLedgerCommitTimestamp.seconds;
						payload=blk.payload;
						payload=window.atob(payload);
						data=payload.split("\n");
						console.log('Hi'+timeConverter(blockTime));
						if(data[6]!=undefined){
						var temp=data[2]+" "+data[3]+" "+data[4]+" "+data[5]+" "+data[6]+" "+data[7];
						$("#d").append('<tr><td><strong>'+(blockNum-i)+'</strong></td><td><strong>'+temp+'</strong></td><td><strong>'+timeConverter(blockTime)+'</strong></td></tr>');
						}
						}
                    },
                    error: function(e){
                        console.log(e);
                    },
                    async: false
                });

                prevFiftyBlocks.push(blockTime);
				if(typeof blk != 'undefined'){
                transData.push(blk.length);
				}
		    }
            else if(blockNum - i == 0) //If genesis block..
            {

                let blk;

                $.ajax({
                    type: 'GET',
                    dataType : 'json',
                    contentType: 'application/json',
                    crossDomain:true,
                    url: 'https://8f9fdaeef1e544829a398e3e20dc0bd9-vp0.us.blockchain.ibm.com:5003/chain/blocks/'+(blockNum-i),
                    success: function(d) {
                        blk = d.transcations;
						blockTime= d.nonHashData.localLedgerCommitTimestamp.seconds;
                    },
                    error: function(e){
                        console.log(e);
                    },
                    async: false
                });
            }
            else
            {
                break;
            }
        }
		});
		
		function timeConverter(UNIX_timestamp){

    let a = new Date(UNIX_timestamp * 1000);

    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();

    let hour = a.getHours();
    let mins = a.getMinutes();
    let sec = a.getSeconds();
    let time = pad(date) + ' ' + month + ' ' + pad(year) + ' ' + pad(hour) + ':' + pad(mins) + ':' + pad(sec) ;

    return time;
}
function pad(value) { //Used for time so that, 12:04 isn't show as 12:4.
    if(value < 10) {
        return '0' + value;
    } else {
        return value;
    }
}