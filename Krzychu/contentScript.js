uruchom = async function()
{
	e = await fetch("https://jbzd.com.pl/auth/me").then(r=>r.json())
	e=((e||{}).user||{}).slug==nick
	if(e){e=700}
	id = await fetch("https://jbzd.com.pl/search/users?page=1&per_page=12&phrase="+nick).then(r=>r.json())
	if((((id||{}).values||[])[0]||{}).slug==nick){id=(((id||{}).values||[])[0]||{}).id}else{id=0}
	if (!id)
	{
		nick=((document.getElementsByClassName(`user-name`)[0].innerHTML.match(/\n *(?<nick>.*) *(?:\n)/)||{}).groups||{}).nick||""
		id = await fetch("https://jbzd.com.pl/search/users?page=1&per_page=12&phrase="+nick).then(r=>r.json())
		if((((id||{}).values||[])[0]||{}).name==nick){id=(((id||{}).values||[])[0]||{}).id}else{id=0}
	}
	if (!id){return alert("coś poszło nie tak")}
	pobierz = new Function("nr",`return fetch("https://jbzd.com.pl/comment/user/listing/`+id+`?page="+nr+"&per_page=25",{headers:{"x-requested-with":"XMLHttpRequest"}}).then(r=>r.json())`)
	ostatniaStrona = await pobierz(1)
	ostatniaStrona=((ostatniaStrona||{}).pagination||{}).last_page
	if (!ostatniaStrona){return alert("coś poszło nie tak")}
	przygotujStrone()
	setTimeout(()=>{pobieranie(ostatniaStrona)},277)
	console.clear()
	function przygotujStrone()
	{
		const styleElement = document.createElement('style');
		styleElement.innerHTML = `
		  .opis {color: #c03e3e}
		  span {color: white;}
		  .procent {color: #93b1cf;}
		  .nazwa {color: #d9cf7f;}
		`;

		document.head.appendChild(styleElement);
		let pole=document.getElementsByClassName(`user-info`)[0]
		let t=``
		t+=`<div class="opis">statystyki na dzień : &nbsp; <span id="dataBadania"></span></div>`
		t+=`<div class="opis">średnia ocena : &nbsp; <span id="sredniaOcena">0</span></div>`
		t+=`<div class="opis">suma plusów : &nbsp; <span id="iloscPlusow">0</span></div>`
		t+=`<div class="opis">suma minusów : &nbsp; <span id="iloscMinusow">0</span></div>`
		t+=`<div class="opis">bilans (plusy-minusy) : &nbsp; <span id="bilans">0</span></div>`
		t+=`<div class="opis">odznaki : złota: <span id="zloto">0</span> srebra: <span id="srebro">0</span> kamienie: <span id="kamien">0</span></div>`
		t+=`<div style="opacity:0.01;">-------`+nick+`-------<span id="sredniaOcena2">0</span></div>`
		t+=`<div class="opis">ilość komentarzy zwykłych : &nbsp; <span id="nieOdpowiedzi">0</span></div>`
		t+=`<div class="opis">ilość komentarzy odpowiedzi : &nbsp; <span id="odpowiedzi">0</span></div>`
		t+=`<div class="opis">procent odpowiedzi : &nbsp; <span class="procent"><span class="procent" id="procentOdpowiedzi">0</span>%</span></div>`
		t+=`<div class="opis">ilość oznaczeń : &nbsp; <span id="oznaczenia">0</span></div>`
		t+=`<div style="opacity:0.01;">-------`+nick+`</div>`
		t+=`<div class="opis">ilość komentarzy wulgarnych : &nbsp; <span id="wulgaryzmy">0</span></div>`
		t+=`<div class="opis">procent komentarzy wulgarnych : &nbsp; <span class="procent"><span class="procent" id="procentWulgaryzmy">0</span>%</span></div>`
		t+=`<div class="opis">ilość pozdrowień : &nbsp; <span id="wyp">0</span></div>`
		t+=`<div class="opis">stopień kontrowersji : &nbsp; <span class="procent"><span class="procent" id="kontrowersja">0</span>%</span></div>`
		t+=`<div style="opacity:0.01;">-------`+nick+`-------<span id="wulgaryzmy2">0</span></div>`
		t+=`<div class="opis">ilość komentarzy według działów: <br><span id="iloscWdziale">...</span></div>`
		t+=`<div style="opacity:0.01;">-------`+nick+`</div>`
		t+=`<div class="opis">ilość komentarzy według dni tygodnia: <br><span id="iloscWdniu">...</span></div>`
		t+=`<div style="opacity:0.01;">-------`+nick+`</div>`
		t+=`<div class="opis">ilość komentarzy według pory dnia: <br><span id="poraDnia">...</span></div>`
		t+=`<div style="opacity:0.01;">-------`+nick+`</div>`
		t+=`<div class="opis">oznaczone osoby: <br><span id="oznaczeni">...</span></div>`
		if(e && 5<7)
		{
			t+=`<div style="opacity:0.01;">-------`+nick+`</div>`
			t+=`<div style="opacity:0.01;">-------`+nick+`</div>`
			t+=`<div style="color:gray;">opcje:</div>`
			t+=`<div style="color:gray;" id="zapiszKomentarze">zapisz komentarze w formacie JSON</div>`
			t+=`<div style="color:gray;" id="zapiszStatystyke">zapisz statystykę w formacie JSON</div>`
			t+=`<div style="color:gray;" id="zapiszZminusowane">zapisz komentarze zminusowane w JSON</div>`
			t+=`<div style="color:gray;" id="zapiszKontrowersyjne">zapisz komentarze kontrowersyjne JSON</div>`
			t+=`<div style="color:gray;" id="zapiszOzlocone">zapisz komentarze ozłocone JSON</div>`
			t+=`<div style="color:gray;" id="zapiszWulgarne">zapisz komentarze wulgarne JSON</div>`
		}
		pole.innerHTML=t
		if(e)
		{
			document.getElementById("zapiszKomentarze").onclick = zapiszKomentarze
			document.getElementById("zapiszStatystyke").onclick = zapiszStatystyke
			document.getElementById("zapiszZminusowane").onclick = zapiszZminusowane
			document.getElementById("zapiszKontrowersyjne").onclick = zapiszKontrowersyjne
			document.getElementById("zapiszOzlocone").onclick = zapiszOzlocone
			document.getElementById("zapiszWulgarne").onclick = zapiszWulgarne
		}
		dataBadania=document.getElementById(`dataBadania`)
		sredniaOcena=document.getElementById(`sredniaOcena`)
		iloscPlusow=document.getElementById(`iloscPlusow`)
		iloscMinusow=document.getElementById(`iloscMinusow`)
		zloto=document.getElementById(`zloto`)
		srebro=document.getElementById(`srebro`)
		kamien=document.getElementById(`kamien`)
		bilans=document.getElementById(`bilans`)
		nieOdpowiedzi=document.getElementById(`nieOdpowiedzi`)
		odpowiedzi=document.getElementById(`odpowiedzi`)
		procentOdpowiedzi=document.getElementById(`procentOdpowiedzi`)
		oznaczenia=document.getElementById(`oznaczenia`)
		wulgaryzmy=document.getElementById(`wulgaryzmy`)
		procentWulgaryzmy=document.getElementById(`procentWulgaryzmy`)
		wyp=document.getElementById(`wyp`)
		iloscWdziale=document.getElementById(`iloscWdziale`)
		poraDnia=document.getElementById(`poraDnia`)
		oznaczeni=document.getElementById(`oznaczeni`)
	}
}
pobieranie = async function(nr)
{
	if (nr<1){return}
	let t = await pobierz(nr)
	if (!t || typeof t!="object"){return alert("wystąpił błąd")}
	if (t.status!="success"){return setTimeout(()=>{pobieranie(nr)},2000)}
	t=((t||{}).pagination||{}).data||[]
	for (let a=t.length-1 ; a>-1 ; a--){if(t[a].removed){t[a].comment="usunięty";t[a].comment_safe="usunięty"};analizaKomentarza(t[a])}
	if (nr==1){return koniec()}
	setTimeout(()=>{pobieranie(nr-1)},1700-(e||0))
	if (true){pokazStatystyki()}
}
analizaKomentarza = function(kom)
{
	let t={}
	t.data=kom.created_at||"?"
	t.dzien=""
	t.poraDnia=""
	if(kom.created_at)
	{
		t.dzien=dzienTygodnia(kom.created_at)
		t.poraDnia=analizaPoryDnia(kom.created_at)
	}
	let e=(Math.min(kom.plus||0,kom.minus||0))
	if (e>3)
	{
		t.kontrowersja=Math.pow(e,1.2)-3
	}
	else {t.kontrowersja=e}
	t.plusy=kom.plus||0
	t.minusy=kom.minus||0||0
	t.odznaki={}
	t.odznaki.zloto=(kom.badge||{}).gold
	t.odznaki.srebro=(kom.badge||{}).silver
	t.odznaki.kamien=(kom.badge||{}).stone
	t.id=kom.id||0
	t.odpowiedz=0
	if (kom.parent_id){t.odpowiedz=1}
	t.idPosta=(kom.commentable||{}).id||0
	t.nazwaPosta=(kom.commentable||{}).title||"?"
	t.dzial="oczekujace"
	if((kom.commentable||{}).state=="main"){t.dzial="glowna"}
	else if((kom.commentable||{}).state && (kom.commentable||{}).state!="spam" && (kom.commentable||{}).state!="queue"){t.dzial=(kom.commentable||{}).state}
	else if (Number((kom.commentable||{}).category_id)>0)
	{
		t.dzial=["oczekujące","motoryzacja","wiedza","nieznany","nieznany","humor","polityka","dowcipy","pasty","czarny-humor","gry","pytanie","sport","hobby","filmy","ciekawostki"][Number((kom.commentable||{}).category_id)]||"oczekujace"
	}
	t.tekst=kom.comment||""
	t.oznaczenia=kom.comment.match(/@\[[^ ]+?\]/g)||[]
	for (let a=0 ; a<t.oznaczenia.length ; a++){t.oznaczenia[a]=t.oznaczenia[a].slice(2,t.oznaczenia[a].length-1)}
	t.wulgarny=0
	if (/(?:[ #\(\{\/:;'"><+\d,\.-=\r\n\t]|^)(?:[wf]y?|[dp]o|prz[ey]|za?|[ous])?(?:kurw|jeb[ai]|(?:z|po)jeb|c?huj|pierd[oa]|pizd|cip|c?holer)[^ _-]{0,8}(?:[ \?!%*)\}\/:;'\"><+\d,\.-=\r\n\t]|$)/i.test(kom.comment_safe)){t.wulgarny=1}
	t.wyp=0
	if (/(?:[ #\(\{\/:;'"><+\d,\.-=\r\n\t]|^)wy[ppp](?:ie|ie)rd(?:a|a)[li]aj(?:[ \?!%*)\}\/:;'\"><+\d,\.-=\r\n\t]|$)/i.test(kom.comment)){t.wyp=1}
	komentarze[komentarze.length]=t
	statystyki(t)
}
statystyki = function(kom)
{
	statystyka.ilosc+=1
	statystyka.plusy+=kom.plusy||0
	statystyka.minusy+=kom.minusy||0
	statystyka.zloto+=(kom.odznaki||{}).zloto||0
	statystyka.srebro+=(kom.odznaki||{}).srebro||0
	statystyka.kamien+=(kom.odznaki||{}).kamien||0
	statystyka.kontrowersja+=kom.kontrowersja
	if(kom.odpowiedz){statystyka.odpowiedzi+=1}
	if(kom.wulgarny){statystyka.wulgaryzmy+=1}
	if(kom.wyp){statystyka.wyp+=1}
	statystyka.oznaczenia+=(kom.oznaczenia||[]).length
	if (!statystyka.iloscWdziale[kom.dzial]){statystyka.iloscWdziale[kom.dzial]=0}
	statystyka.iloscWdziale[kom.dzial]+=1
	if (!statystyka.iloscWdniu[kom.dzien]){statystyka.iloscWdniu[kom.dzien]=0}
	statystyka.iloscWdniu[kom.dzien]+=1
	if (!statystyka.poraDnia[kom.poraDnia]){statystyka.poraDnia[kom.poraDnia]=0}
	statystyka.poraDnia[kom.poraDnia]+=1
	for (let a=0 ; a<kom.oznaczenia.length ; a++)
	{
		if (!statystyka.oznaczeni[kom.oznaczenia[a]]){statystyka.oznaczeni[kom.oznaczenia[a]]=0}
		statystyka.oznaczeni[kom.oznaczenia[a]]+=1
	}
	if (kom.minusy>14 && !(/[{}<>]/.test(kom.tekst))){wybrane.zminusowane[wybrane.zminusowane.length]=kom}
	if (kom.kontrowersja>3 && !(/[{}<>]/.test(kom.tekst))){wybrane.kontrowersyjne[wybrane.kontrowersyjne.length]=kom}
	if (kom.odznaki.zloto && !(/[{}<>]/.test(kom.tekst))){wybrane.ozlocone[wybrane.ozlocone.length]=kom}
	if (kom.wulgarny && !(/[{}<>]/.test(kom.tekst))){wybrane.wulgarne[wybrane.wulgarne.length]=kom}
}
pokazStatystyki = function()
{
	dataBadania.innerHTML=((komentarze[komentarze.length-1]||{}).data||"XXXX-XX-XX").slice(0,10)
	sredniaOcena.innerHTML=zaokraglij((statystyka.plusy-statystyka.minusy)/(statystyka.ilosc||1))
	sredniaOcena2.innerHTML=zaokraglij((statystyka.plusy-statystyka.minusy)/(statystyka.ilosc||1))
	iloscPlusow.innerHTML=statystyka.plusy
	iloscMinusow.innerHTML=statystyka.minusy
	bilans.innerHTML=(statystyka.plusy-statystyka.minusy)
	zloto.innerHTML=statystyka.zloto
	srebro.innerHTML=statystyka.srebro
	kamien.innerHTML=statystyka.kamien
	nieOdpowiedzi.innerHTML=statystyka.ilosc-statystyka.odpowiedzi
	odpowiedzi.innerHTML=statystyka.odpowiedzi
	procentOdpowiedzi.innerHTML=zaokraglij((statystyka.odpowiedzi/statystyka.ilosc)*100,2)
	oznaczenia.innerHTML=statystyka.oznaczenia
	wulgaryzmy.innerHTML=statystyka.wulgaryzmy
	wulgaryzmy2.innerHTML=statystyka.wulgaryzmy
	procentWulgaryzmy.innerHTML=zaokraglij((statystyka.wulgaryzmy/statystyka.ilosc)*100,2)
	wyp.innerHTML=statystyka.wyp
	kontrowersja.innerHTML=zaokraglij(((statystyka.kontrowersja)/statystyka.ilosc),2)
	iloscWdziale.innerHTML=segregowane(statystyka.iloscWdziale)
	iloscWdniu.innerHTML=segregowane(statystyka.iloscWdniu)
	poraDnia.innerHTML=segregowane(statystyka.poraDnia)
	let t={};for (v in statystyka.oznaczeni){if(statystyka.oznaczeni[v]>19 && !(/[<>]/.test(v))){t[v]=statystyka.oznaczeni[v]}}
	oznaczeni.innerHTML=segregowane(t)
	document.getElementsByClassName(`user-info`)[0]
	function segregowane(dane)
	{
		s=""
		let t=[]
		for (const v in dane)
		{
			t[t.length]=[v,dane[v],1]
		}
		let tt=[]
		for (let i=0 ; i<t.length ; i++)
		{
			let max=[0,0]
			for (let a=0 ; a<t.length ; a++)
			{
				if (t[a][2])
				{
					if (t[a][1]>max[1])
					{
						max[1]=t[a][1]
						max[0]=a
					}
				}
			}
			t[max[0]][2]=0
			tt[tt.length]=t[max[0]]
		}
		for (let a=0 ; a<tt.length ; a++)
		{
			s+=`<span class="nazwa">`+tt[a][0]+": &nbsp; </span>"+tt[a][1]+` &nbsp; <span class="procent">(`+zaokraglij((tt[a][1]/statystyka.ilosc)*100,2)+`%)</span><br>`
		}
		return s
	}
}
zaokraglij = function(liczba,miejsca)
{
	let t=Math.pow(10,(miejsca||3))||10
	return Math.round(liczba*t)/t
}
dzienTygodnia = function(dateString)
{
	const date = new Date(dateString);
	const dayOfWeekNumber = date.getDay();
	return ["niedziela","poniedziałek","wtorek","środa","czwartek","piątek","sobota"][dayOfWeekNumber];
}
analizaPoryDnia = function(dateString)
{
	const godzina=Number((dateString||"XXXX-XX-XX 12").slice(11,13))
	if (godzina<4){return "noc"}
	if (godzina<8){return "wczesny poranek"}
	if (godzina<12){return "rano"}
	if (godzina<17){return "po południu"}
	if (godzina<19){return "pod wieczór"}
	if (godzina<23){return "wieczór"}
	return "noc"
}
zapiszKomentarze = function(){downloadTextFile(JSON.stringify(komentarze),"komentarze użytkownika "+nick+" JSON")}
zapiszStatystyke = function(){downloadTextFile(JSON.stringify(statystyka),"statystyka komentarzy użytkownika "+nick+" JSON")}
zapiszZminusowane = function(){downloadTextFile(JSON.stringify(wybrane.zminusowane),"zminusowane komentarze użytkownika "+nick+" JSON")}
zapiszKontrowersyjne = function(){downloadTextFile(JSON.stringify(wybrane.kontrowersja),"kontrowersyjne komentarze użytkownika "+nick+" JSON")}
zapiszOzlocone = function(){downloadTextFile(JSON.stringify(wybrane.ozlocone),"ozłocone komentarze użytkownika "+nick+" JSON")}
zapiszWulgarne = function(){downloadTextFile(JSON.stringify(wybrane.wulgarne),"wulgarne komentarze użytkownika "+nick+" JSON")}
downloadTextFile = function(text, fileName)
{
	//funkcja wygenerowana poprzez chat GPT
	const element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', fileName);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}
nick=((window.location.href.match(/jbzd\.com\.pl\/uzytkownik\/(?<nick>.*)\/komentarze/)||{}).groups||{}).nick
komentarze=[]
statystyka={plusy:0,minusy:0,ilosc:0,odpowiedzi:0,oznaczenia:0,wulgaryzmy:0,wyp:0,zloto:0,srebro:0,kamien:0,kontrowersja:0,iloscWdziale:{},iloscWdniu:{},poraDnia:{},oznaczeni:{}}
wybrane={zminusowane:[],kontrowersyjne:[],ozlocone:[],wulgarne:[]}
if (nick)
{
	let e=document.getElementsByClassName("user-ranks")[0]
	e.innerHTML=e.innerHTML+`<div id="statystyki">statystyki</div>`
	document.getElementById("statystyki").onclick = uruchom
	console.clear()
}
