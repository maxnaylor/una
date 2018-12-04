// Skills - Radio

function respondRadio(input) {
	var analysis = analyseIntent(input);
	var response = '';
	if(analysis.intent=='radioSchedule') {
		
		if(!analysis.provider || analysis.provider=='ras1') {				
			respondLoading();		
			var channel = {
				name      : "Rás 1", 
				shortname : "ras1", 
				feedURL   : "http://muninn.ruv.is/files/xml/ras1/",
				watchURL  : "http://www.ruv.is/utvarp/beint?channel=ras1"
			};
		} else if(analysis.provider=='ras2') {
			respondLoading();
			var channel = {
				name      : "Rás 2", 
				shortname : "ras2", 
				feedURL   : "http://muninn.ruv.is/files/xml/ras2/",
				watchURL  : "http://www.ruv.is/utvarp/beint?channel=ras2"
			};	
		}
		
		console.log('Interpretation: Radio schedule request for '+channel.name);
		
		var yql = URL = [
	        'https://query.yahooapis.com/v1/public/yql',
	        '?q=' + encodeURIComponent("select service from xml where url='"+channel.feedURL+ "'"),
	        '&format=json&callback=?'
	    ].join('');	
	    
		var request = $.ajax({
			dataType: 'jsonp',
			url: yql,
			type: 'GET',
			success: function(response) {
				
				loadingComplete();
				var $schedule = '';			    
			    var scheduleData = response.query.results.schedule.service.event;
			    
			    console.log(scheduleData);
			    
			    if(scheduleData.length>0) {
				    
				    $schedule += '<div class="card tvguide"><img class="provider" src="images/provider_'+channel.shortname+'.svg" /><table>';
				    if(channel.watchURL) { $schedule += '<a class="watch" href="'+channel.watchURL+'" target="_new" title="Hlusta á '+channel.name+'">▶︎ Hlusta</a>';	}
					$schedule += '<table>';
				    	
				    var row = 1;	    
					$.each(scheduleData, function(i, v) {						
						if(row<5) {
							var startTime = moment(v['start-time']);
							if(startTime>Date.now()) {	
								$schedule += '<tr><td class="time">'+moment(startTime).format('LT')+'</td>'    
								$schedule += '<td>'+v.title;
								$schedule += '</td></tr>';
								row++;
							}
						}
				    });
					$schedule += '</table>';
					if(row>4) {
						$schedule += '<a class="moreinfo" href="'+channel.url+'" target="_new">Nánar…</a>';
					}
					if(row==1) {
						$schedule += '<table><tr><td class="noschedule">Enginn dagskrárliður</td></tr></table>';
					}
				    $schedule += '</div>';
				    
				    var d = new Date();
				    if(d.getHours()>17) {
					    var timePhrase = 'í kvöld';
				    } else {
					    var timePhrase = 'í dag';
				    }
				    
					appendOutput({ output: 'Þetta er dagskráin á '+channel.name+' '+timePhrase+':<br />',
								   outputData: $schedule, 
						           outputPhrase: 'Þetta er dagskráin á '+channel.name+' í dag:' });
						           
			    } else {
				    
				    appendOutput({ output: 'Ég get ekki sótt þessar upplýsingar í augnablikinu.' });
				    
			    }				   
			},
			error: function(error) {		    
			    loadingComplete();
			    appendOutput({ output: 'Ég get ekki sótt þessar upplýsingar í augnablikinu.' });
		    }
		});
		return true;
	}
}