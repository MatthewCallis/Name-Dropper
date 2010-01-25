var name_droper = function(){
	var doc = document.documentElement;
	var scripts = doc.getElementsByTagName("script");
	var pt_test = /_getTracker|trackPage/i;
	var status = false;
	for(var i in scripts){
		var s = scripts[i];
		if(s.src) continue;
		if(pt_test.test(s.innerText)){
			var s = s.innerText;
			var ga_code = s.match(/(_getTracker|trackPage)\([\"\'](.*)[\"\']\)/i);
			// Hopefully found something by now
			if(ga_code){
				// send back to background page
				chrome.extension.sendRequest({msg: "name-dropper"}, function(response){
					if(!response.name || !response.site){
						return;
					}
					var name_dropper = document.createElement('script');
					name_dropper.setAttribute('id','name_dropper');
					name_dropper.setAttribute('type','text/javascript');
					var code = document.createTextNode("try{pageTracker._trackEvent('Guest List', 'Visit', '"+response.name+" ("+response.site+")');}catch(err){};");
					name_dropper.appendChild(code);
					document.body.appendChild(name_dropper);
					console.log(response.name+" ("+response.site+")");
				});
			}
		}
	}
};
name_droper();