/* global new_block,formatDate, randStr, bag, $, clear_blocks, document, WebSocket, escapeHtml, window */
'use strict';
var ws = {};

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

// =================================================================================
// On Load
// =================================================================================
$(document).ready(function() {
    connect_to_server(); 
    console.log('in ready');
	
	
	// =================================================================================
	// jQuery UI Events
	// =================================================================================
	$('#sub').click(function(){
		//console.log('creating property');
       //$('#propertyregisterfrom').submit();
          
            $('#myModal').modal('hide');
              console.log('form data');
              var data = $('#propertyregisterfrom').serializeArray();
		var obj = 	{
						/*type: 'create',
						name: $('input[name="owner"]').val().replace(' ', ''),
						adhaar_no: $('select[name="acnumber"]').val(),
						survey_no: $('select[name="surveyNo"]').val(),
						location: $('select[name="loc"]').val(),
						area: $('select[name="areaDet"]').val(),
                        
                        */
                        
                        
                        type: 'create',
						name: data[0].value,
                        
						adhaar_no: data[1].value,
						survey_no: data[2].value,
						location: data[3].value,
						area: data[4].value,
                        		v:1
                        
					};
                    console.log(obj.area+'*'+obj.name+'*'+ obj.location+'*'+obj.adhaar_no+'*'+obj.survey_no);
		if(obj.area && obj.name && obj.location && obj.adhaar_no && obj.survey_no){
			
            console.log('creating property, sending', obj);
			ws.send(JSON.stringify(obj));
		}
		return false;
	});
    
     $('a.lnk').click(function(){
        
        
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
	
	for(let i = 1; i <= chainHeight; i++)
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
						console.log(data[3]+' is NAME');
                        console.log((data[3].toLowerCase()).trim()===("Pooja Dontul".toLowerCase()).trim() + ' t/f');
                            if((data[3].toLowerCase()).trim()===("Pooja Dontul".toLowerCase()).trim()){
                                //var temp=data[2]+" "+data[3]+" "+data[4]+" "+data[5]+" "+data[6]+" "+data[7];
                                console.log('input  '+data[3]);
                                $("#ppp").append('<input type="checkbox" >'+data[3]+' '+data[4]+'</input><br>')
                               // $("#abc").load(data[4])
                                //$("ul").add('<li class="list-group-item" style="display:block"><label><input type="checkbox" value=""   >'+data[3]+'-'+data[4]+'</label></li>');
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

               // $('#blockScroll').prepend('<div class="singleBlockContainer"><div class="exBlock notClicked" onclick="changeShape(this)"><span>'+(blockNum-i)+'</span></div><br /><div class="triangle_down_big"></div><div class="triangle_down"></div><div class="blockData"><span class="blockHash"><b>Block Hash: </b><br />'+lastBlockHash+'</span><br /><br /><span class="blockTimeAdded"><b>Added to Chain: </b><br />'+timeConverter(blockTime)+'</span><br /><br /><span class="blocksTransactionsHdr" >Transactions:</span><br /><span class="blocksTransactions">No transactions in the Genesis block.</span></div><input type="hidden" class="height" value="'+270+'"></input></div>');
            }
            else
            {
                break;
            }
        }
		});

        
        
    

   
});
	


// =================================================================================
// Socket Stuff
// =================================================================================
function connect_to_server(){
	var connected = false;
	connect();
	function connect(){
		var wsUri = 'ws://' + document.location.hostname + ':' + document.location.port;
		console.log('Connectiong to websocket', wsUri);
		
		ws = new WebSocket(wsUri);
		ws.onopen = function(evt) { onOpen(evt); };
		ws.onclose = function(evt) { onClose(evt); };
		ws.onmessage = function(evt) { onMessage(evt); };
		//ws.onerror = function(evt) { onError(evt); };
	}
	
	function onOpen(evt){
		console.log('WS CONNECTED');
		connected = true;
		//clear_blocks();
		$('#errorNotificationPanel').fadeOut();
		ws.send(JSON.stringify({type: 'get', v:1}));
		ws.send(JSON.stringify({type: 'chainstats', v:1}));
	}

	function onClose(evt){
		console.log('WS DISCONNECTED', evt);
		connected = false;
		setTimeout(function(){ connect(); }, 5000);					//try again one more time, server restarts are quick
	}

	function onMessage(msg){
		try{
			var msgObj = JSON.parse(msg.data);
			if(msgObj.property){
				console.log('rec', msgObj.msg, msgObj);
			}
			else if(msgObj.msg === 'chainstats'){
				console.log('rec', msgObj.msg, ': ledger blockheight', msgObj.chainstats.height, 'block', msgObj.blockstats.height);
				var e = formatDate(msgObj.blockstats.transactions[0].timestamp.seconds * 1000, '%M/%d/%Y &nbsp;%I:%m%P');
				$('#blockdate').html('<span style="color:#fff">TIME</span>&nbsp;&nbsp;' + e + ' UTC');
				var temp =  {
								id: msgObj.blockstats.height, 
								blockstats: msgObj.blockstats
							};
				//new_block(temp);								//send to blockchain.js
			}
			else console.log('rec', msgObj.msg, msgObj);
		}
		catch(e){
			console.log('ERROR', e);
		}
	}

	function onError(evt){
		console.log('ERROR ', evt);
		if(!connected && bag.e == null){											//don't overwrite an error message
			$('#errorName').html('Warning');
			$('#errorNoticeText').html('Waiting on the node server to open up so we can talk to the blockchain. ');
			$('#errorNoticeText').append('This app is likely still starting up. ');
			$('#errorNoticeText').append('Check the server logs if this message does not go away in 1 minute. ');
			$('#errorNotificationPanel').fadeIn();
		}
	}
}
