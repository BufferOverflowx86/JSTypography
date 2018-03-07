/*!
 * JS Typograph
 * The Javascript Typography Correcter
 * 
 * @version   2.2.8 (build 07.03.2018)
 * @author    Данил Ерошенко «BufferOverflow» <buffer.overflow.x86 at gmail dot com> (based on JSTypograf by UnderShot <mail at undershot dot ru>)
 * @link      https://github.com/BufferOverflowx86/JSTypography
 * @license   http://www.freebsd.org/copyright/freebsd-license.html
 * @example   jstypograf({obj:["my_button","button2"],nbspobj:"sub_button",bind:"click",language:"rus",type:"norm",txts:["textarea1","bl17~textarea2","+abc"],off:["quotes"]})
 */

(function(undefined){
	window.typo=window.jstypograf=window.jstypograph=jstypo=function(TYPO){
		/** Отключение функций **/
		if(!Array.indexOf){	//IE must die
			Array.prototype.indexOf = function(obj){
				for(var i=0; i<this.length; i++){
					if(this[i]==obj){
						return i;
					}
				}
				return -1;
			}
		}
		if(!String.r){
			String.prototype.r = String.prototype.replace
		}
		var off=TYPO.only?[]:!TYPO.off?[]:TYPO.off,opts=["quotes","functions","chars","spaces","dashs","tabs","nbsptabs","nbsp","br","href","h1","claw"],t=function(a){
			return off.indexOf(a)==-1;
		};
		function rS2T(a){
			a=a.r(/ /g,"&nbsp;");
			return a;
		};
		/** Замена четырёх пробелов на табуляцию (постобработка) **/
		function r2Tabs(){
			if(t("nbsptabs")){
				if(typof(TYPO,"object")){
					if(TYPO.txts){
						i=arrayEditor(i,TYPO.txts);
					}
					
					if(inst(i,Array)){
						for(var o in i){
							i[o]=typof(i[o],"string")?id(i[o]):i[o];
							if(i[o]&&i[o].value!=undefined){
								b=i[o];
								b.value=rS2T(b.value);
								//runTypograf(b.value)
							}
						}
					}
					else{
						b=id(i);
						b.value=rS2T(b.value);
						//runTypograf(b.value)
					}
				}
			}//( | ) это sp | nbsp.
		};
		var a=document,lochash=a.location.pathname.split("/")[1];
		var typobegin,typoend;
		/** Инициализация **/
		function init(){
			var g=lochash,i=g=="forum"||g=="gb"?"message":["brief","message"],b;
			if(typof(TYPO,"object")){
				if(TYPO.txts){
					i=arrayEditor(i,TYPO.txts);
				}
				
				if(inst(i,Array)){
					for(var o in i){
						i[o]=typof(i[o],"string")?id(i[o]):i[o];
						if(i[o]&&i[o].value!=undefined){
							b=i[o];
							var textScroll = b.scrollTop;
							b.value=typoSelection(b);
							b.scrollTop = textScroll;
							//runTypograf(b.value)
						}
					}
				}
				else{
					b=id(i);
					var textScroll = b.scrollTop;
					b.value=typoSelection(b);
					b.scrollTop = textScroll;
					//runTypograf(b.value)
				}
			}
		};
		/** Изменение конфигурации **/
		window.changeTypoConf=function(NewTypo){
			off=NewTypo.off;
			TYPO.language=NewTypo.language;
			TYPO.type=NewTypo.type;
		};
		function id(b){
			return a.getElementById(b);
		};
		function addEvent(a,b,c){
			try{
				a.addEventListener(b,c,false);
			}
			catch(e){
				a.attachEvent("on"+b,c);
			}
		};
		function removeEvent(a,b,c){
			try{
				if (a.addEventListener){
					a.removeEventListener(b,c,false);
				}
				else{
					a.detachEvent ("on"+b,c);
				}
			}catch(e){
			}
		};
		function inst(a,b){
			return a instanceof b;
		};
		function typof(a,b){
			return typeof(a)==b;
		};
		/** Функция для обработки массива параметров **/
		function arrayEditor(a,b){
			var u=typof(b,"string")?[b]:b,a=typof(a,"string")?[a]:a;
			for(var i=0,r;i<u.length;i++){
				u[i]=u[i];
				r=u.length==1?u[0]:u[i];
				if(/^\+/g.test(r)){
					a.push(r.r(/^\+/g,""));
				}
				else if(/^-/g.test(r)){
					for(var o=0;o<a.length;o++){
						if(a[o]==r.r(/^-/g,"")){
							a.splice(o,a[o]==a[0]?o+1:o);
						}
					}
				}
				else if(/~/g.test(r)){
					r=r.split("~");
					for(var o=0;o<a.length;o++){
						if(a[o]==r[0]){
							a[o]=r[1];
						}
					}
				}
				else{
					a=b;
				}
			}
			return a;
		};
		/** Обработка выделенного текста **/
		function typoSelection(a){
			typobegin=true;
			typoend=true;
			var txt='',ret='',typotext;
			
			if (a&&a.value&&a.selectionStart!=undefined){
				var startPos = a.selectionStart;
				var endPos = a.selectionEnd;
				txt = a.value.substring(startPos, endPos);
				if (txt == ''){
					ret=runTypograf(a.value);
				}else{
					if(startPos!=0){
						if(a.value.charAt(startPos-1)!='\n'&&a.value.charAt(startPos-1)!='\r'){
							typobegin=false;
						}
					}
					if(endPos!=a.value.length){
						if(a.value.charAt(endPos)!='\n'&&a.value.charAt(endPos)!='\r'){
							typoend=false;
						}
					}
					typotext=runTypograf(txt);
					ret = a.value.substring(0, startPos) + typotext + a.value.substring(endPos);
				}
				//a.selectionStart = startPos;
				//a.selectionEnd = startPos + typotext.length;
			}else if (document.selection && document.selection.createRange) { //IE must die
				var range = document.selection.createRange();
				txt = range.text;
				if (txt == ''){
					ret=runTypograf(a.value);
				}
				else{
					typobegin=false;
					typoend=false;
					typotext=runTypograf(txt);
					range.text = typotext;
					//if (range.moveStart) range.moveStart('character', - typotext.length)
					//	range.select();
					ret=a.value;
				}
			 
			}else{ // other browsers
				ret=runTypograf(a.value);
			}
			
			return ret;
		};
		/** Типографическая обработка текста **/
		function runTypograf(a){
			//\(/[^/]*?[^\\)a]\.[^/]*?/ - используй для поиска регулярок, где ты забыл, что точка это не . а \.
			var s,nbsp,m=[],tag="untypo",w;
			var r=function(a,b){return new RegExp(a,b)};
			if(!typof(TYPO.type,"string")){
				TYPO.type="norm";
			}
			if(TYPO.type!="norm"&&TYPO.type!="html"){
				TYPO.type="norm";
			}
			/** Используемые символы **/
			var normsym=["—",		"«",		"»",		"…",		"©",		"®",		"™",		"←",		"→",		"↑",		"↓",		"↔",		"°",		"́",			"×",		"≠",		"±",		"↕",		"‘",		"’",		"−",		"–",		"“",		"”",		"„",		"≥",		"≤",		"§",		"€",		"£",		"″",		"√",		"∫",		"½",		"¼",		"¾",		" ",		"‚",		"¹",		"²",		"³",		"⅓",		"⅔",		"⅕",		"⅖",		"⅗",		"⅘",		"⅙",		"⅚",		"⅛",		"⅜",		"⅝",		"⅞",		"≈",		'"',		"⁰",		"⁴",		"⁵",		"⁶",		"⁷",		"⁸",		"⁹",		"⁺",		"⁻",		"⁼",		"⁽",		"⁾",		"ⁿ",		"ⁱ",		"₀",		"₁",		"₂",		"₃",		"₄",		"₅",		"₆",		"₇",		"₈",		"₉",		"₊",		"₋",		"₌",		"₍",		"₎"];
			var htmlsym=["mdash",	"laquo",	"raquo",	"hellip",	"copy",		"reg",		"trade",	"larr",		"rarr",		"uarr",		"darr",		"harr",		"deg",		"#769",		"times",	"ne",		"plusmn",	"#8597",	"lsquo",	"rsquo",	"minus",	"ndash",	"ldquo",	"rdquo",	"bdquo",	"ge",		"le",		"sect",		"euro",		"pound",	"Prime",	"radic",	"int",		"frac12",	"frac14",	"frac34",	"nbsp",		"sbquo",	"sup1",		"sup2",		"sup3",		"#8531",	"#8532",	"#8533",	"#8534",	"#8535",	"#8536",	"#8537",	"#8538",	"#8539",	"#8540",	"#8541",	"#8542",	"#8776",	"quot",		"#8304",	"#8308",	"#8309",	"#8310",	"#8311",	"#8312",	"#8313",	"#8314",	"#8315",	"#8316",	"#8317",	"#8318",	"#8319",	"#8305",	"#8320",	"#8321",	"#8322",	"#8323",	"#8324",	"#8325",	"#8326",	"#8327",	"#8328",	"#8329",	"#8330",	"#8331",	"#8332",	"#8333",	"#8334"];
						//	0			1			2			3			4			5			6			7			8			9			10			11			12			13			14			15			16			17			18			19			20			21			22			23			24			25			26			27			28			29			30			31			32			33			34			35			36			37			38			39			40			41			42			43			44			45			46			47			48			49			50			51			52			53			54			55			56			57			58			59			60			61			62			63			64			65			66			67			68			69			70			71			72			73			74			75			76			77			78			79			80			81			82			83
			/** Преобразование only в off **/
			if(TYPO.only){
				var i=TYPO.only;
				for(var u=0;u<opts.length;u++){
					if(typeof i=="object"){
						if(opts[u]!=i[u]){
							off.push(opts[u])
						}
					}
					else{
						if(opts[u]!=i){
							off.push(opts[u]);
						}
					}
				}
			};
			/** Регулярки на имейлы и ссылки **/
			var RegLink=r('([  \n\t\v]|^)(((ht|f)tps?://)?([\\-\\w]+:[\\-\\w]+@)?([0-9a-z][\\-0-9a-z]*[0-9a-z]\\.)+[a-z]{2,6}(:\\d{1,5})?([?/\\\\#][?!^$.(){}:|=[\\]+\\-/\\\\*;&~#@,%\\wА-Яа-я]*)?)([  \n\t\v]|$)',"gi");
			var RegMail=r("([  \n\t\v]|^)([\\-a-z0-9!#$%&'*+\\/=?^_`{|}~]+(\\.[\\-a-z0-9!#$%&'*+\\/=?^_`{|}~]+)*@([a-z0-9]([\\-a-z0-9]{0,61}[a-z0-9])?\.)*([a-z]{2,6}))([  \n\t\v]|$)","gi");
			/** Пометка на экранирование тэгов, кодов, цитат и т.п. **/
			a=a.r(/(\r\n|\r)/g,"\n").r(/(\[code\]|\[quote[^\]$\n]*\]|<pre[^<>]*?>|\[img\])/g,"<"+tag+">"+"$1").r(/(\[\/code\]|\[\/quote\]|<\/pre>|\[\/img\])/g,"$1"+"</"+tag+">").r(/(<script[^<>]*?>|<style[^<>]*?>)/g,"<"+tag+">"+"$1").r(/(<\/script>|<\/style>)/g,"$1"+"</"+tag+">").r(/(<!--(.|\n)*?-->)/g,"<"+tag+">"+"$1"+"</"+tag+">").r(/(\[url[^\[\]]+?\])/g,"<"+tag+">"+"$1"+"</"+tag+">").r(/(="[^"\n\r]*")/g,"<"+tag+">"+"$1"+"</"+tag+">");

			/** Удаление вложенных <untypo> **/
			for(var i=0;i<10;++i){
				a=a.r(r("(<"+tag+">)([\\s\\S]*?)(<\\/?"+tag+">)","g"),function($0,$1,$2,$3){
					if($3.charAt(1)!='/'){
						return $1+$2;
					}
					else{
						return $0;
					}
				});
				a=a.r(r("(<\\/"+tag+">)([\\s\\S]*?)(<\\/?"+tag+">)","g"),function($0,$1,$2,$3){
					if($3.charAt(1)=='/'){
						return $2+$3;
					}
					else{
						return $0;
					}
				});
			}
			//На случай, если UNTYPOXXXS уже встречаются в тексте, экранируем их во избежание конфликтов
			a=a.r(/(UNTYPO[\d]S+)/g,"<"+tag+">$1</"+tag+">");
			
			//if(TYPO.type=="norm"){
 			//((http|https|ftp):\/\/)?([[a-zA-Z0-9]\-\.])+(\.)([[a-zA-Z0-9]]){2,4}([[a-zA-Z0-9]\/\(\)@+=%&#!_\.~?\\-]*)$
			/** Функция для экранирования **/
			function shield(z){
				s=a.match(r("<"+tag+">[\\s\\S]+?</"+tag+">","g"));
				var i=0;
				if(s){
					for(;i<s.length;i++){
						var re=s[i].r(r("<\\/?"+tag+">","g"),"");
						m.push(re);
						a=a.r("<"+tag+">"+re+"</"+tag+">","UNTYPO"+(i+z)+"S")
					}
				}
				return i+z;
			};
			/** Экранирование **/
			var z=shield(0);
			/** Обработка ссылок **/
			if(TYPO.type=="html" && t("href")){
				for(var i=0;i<2;++i){
					a=a.r(RegLink,'$1<'+tag+'><a href="$2">$2</a></'+tag+'>$9');
					a=a.r(RegMail,'$1<'+tag+'><a href="mailto:$2">$2</a></'+tag+'>$7');
				}
			}
			else{//ссылки просто экранируются
				for(var i=0;i<2;++i){
					a=a.r(RegLink,"$1<"+tag+">"+"$2"+"</"+tag+">$9").r(RegMail,"$1<"+tag+">"+"$2"+"</"+tag+">$7");
				}
			}
			/** Экранирование ссылок **/
			z=shield(z);
			/** Замена html символов на обычные **/
			for(var i=0;i<htmlsym.length;++i){
				a=a.r(r("&"+htmlsym[i]+";","g"),normsym[i]);
			}
			/** замена <br> на перенос **/
			if(t("br")){
				a=a.r(/<br( *[^\n>]*?)?\/?>/gi,"\n");
			}
			/** удаление параграфов и заголовков**/
			//if(t("tabs")){
				a=a.r(/<\/?p>/gi,"");
				a=a.r(/<\/?h1>/gi,"");
				a=a.r(/<\/?nbsp>/gi,"");
			//}
			/** замена символов © ® ™ **/
			if(t("chars")){
				a=a.r(/\(c\)/g,"©").r(/\(r\)/g,"®").r(/\(tm\)/g,"™");
			}
			if(TYPO.type!="html"&&t("chars")){
				a=a.r(/&lt;/g,"<").r(/&gt;/g,">");
			}
			/** Замена всех кучерявых кавычек на обычные **/
			if(t("quotes")){
				a=a.r(/«|»|”|“|„/g,'"');
				if(TYPO.language!="eng"){
					a=a.r(/‚|‘/g,'"');
				}
			}
			/** Обработка функций **/
			if(t("functions")){
				var q=function (a,b,c){
					var l="ABGDEZHJIKLMNQCOPRSTYUFXVWabgdezhjiklmnqcoprstyufxvw", g="ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΞΟΠΡΣΤΥΥΦΧΨΩαβγδεζηθικλμνξξοπρστυυφχψω";
					for(var i=0;i<52;++i){
						if(c==l.charAt(i)){
							return g.charAt(i);
						}
					}
					return '?';
				};
				a=a.r(/(УДАР|ACNT)\(([\wА-яёЁ]?)\)/g,"$2́").r(/(СТРЛ|ARRW)\(([\wА-яёЁ]+?)\)/g,function(b,c,a){return a=="В"||a=="U"?"↑":a=="Н"||a=="D"?"↓":a=="Л"||a=="L"?"←":a=="П"||a=="R"?"→":a=="ЛП"||a=="LR"?"↔":a=="ВН"||a=="UD"?"↕":b}).r(/(ГРАД|DEGR)\(([0-9\.]*)\)/g, "$2°").r(/(ПАРА|SECT)\(([IVXLСDМ0-9]*)\)/g, "§ $2").r(/(ЕВРО|EURO)\(([0-9\.]*)\)/g, "$2€").r(/(ФУНТ|PUND)\(([0-9\.]*)\)/g, "$2£").r(/(ДЮЙМ|INCH)\(([0-9\.]*)\)/g, "$2″").r(/(КОРН|SQRT)\(([\w0-9]*)\)/g, "√$2").r(/(ИНТГ|INTG)\(([\w0-9]*)\)/g, "∫$2").r(/(ГРЕЧ|GREK)\(([A-Za-z])\)/g, q);
				s=a.match(/(ВЕРХ|SUPS)\[([0-9+\-=\(\)ni]+)\]/g);
				if(s){
					for(var i=0;i<s.length;++i){
						var l="0123456789-=ni", g="⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁼ⁿⁱ";
						var re=s[i].r(/(ВЕРХ|SUPS)\[([0-9+\-=\(\)ni]+)\]/g,"$2");
						for(var j=0;j<14;++j){
							re=re.r(r(l.charAt(j),"g"),g.charAt(j));
						}
						re=re.r(/\+/g,'⁺').r(/\(/g,'⁽').r(/\)/g,'⁾');
						a=a.r(s[i],re);
					}
				}
				s=a.match(/(НИЖН|SUBS)\[([0-9+\-=\(\)]+)\]/g);
				if(s){
					for(var i=0;i<s.length;++i){
						var l="0123456789-=", g="₀₁₂₃₄₅₆₇₈₉₋₌";
						var re=s[i].r(/(НИЖН|SUBS)\[([0-9+\-=\(\)]+)\]/g,"$2");
						for(var j=0;j<12;++j){
							re=re.r(r(l.charAt(j),"g"),g.charAt(j));
						}
						re=re.r(/\+/g,'₊').r(/\(/g,'₍').r(/\)/g,'₎');
						a=a.r(s[i],re);
					}
				}
				
			};
			/** Простановка пробелов и nbsp **/
			if(t("spaces")){
				if(typobegin){
					a=a.r(/(^)[ \t]+/g,"$1");
				}
				a=a.r(/([\d]) ?(€|£|л\.|[скм]?м[\/\^¹²³\.\s]|г[аг]?[\s\.]|ц\.|т[\s\.]|р\.|руб\.|уе|тыс\.|млн|млрд)/g, "$1 $2").r(/([\d]) г\.[  ]?г\./g,"$1 гг.").r(/([IVXLCDM]) ?(вв?\.)/g,"$1 $2").r(/([IVXLCDM]) в\.[  ]?в\./g,"$1 вв.");
				a=a.r(/([^\d]|^)([\d]+(?:[\.,][\d]+)?) ?\$/g,"$1$$$2").r(/(\,|;|:|!|\?|\))([^\d\s=?!:,\.'’‘‚"«»“”\[])/gi,"$1 $2").r(/(\[color=[^\n]*\])( | )( | )( | )( | )/g,"$2"+"$3"+"$4"+"$5"+"$1").r(/ {2,}/g," ").r(/\.([^\s\dA-Za-z\n=?:;,\.'’‘"»„“”\[]+)/gi,". $1").r(/([А-яёЁ])\.([^\sA-Za-z\n=?:;,\.'’‘"»„“”\[]+)/g,"$1. $2").r(/ (\.|,|!|\?|;|:)/g,"$1").r(/(—|–|-)\.{2,4} /g,"$1 ...").r(/(\n|^|&)( *)\.{2,4} /g,"$1"+"$2...").r(/(['‘‚"«„“\(])\.{2,4} /g,"$1...").r(/\( /g,"(").r(/ \)/g,")").r(/([^\s])\(/g, "$1 (").r(/([^\d])(,|\.)([\d])/g,"$1"+"$2 $3").r(/(!|\?|\))([^\s=?!:,\.'’‘‚"«»“”\[]+)/gi,"$1 $2").r(/ %/g,"%").r(/P\. ?P\. ?S\./g,"P. P. S.").r(/P\. ?S\./g,"P. S.").r(/и др\./g,"и др.").r(/([\s]|^)(гл?|ул|д|илл)\. ([A-Za-zА-яёЁ0-9])/g,"$1"+"$2. $3").r(/(\s|^)([тнсюзв])\. ?([еочнпдшдэ])\./g,"$1"+"$2. $3.").r(/(\s|^)т\.? ?([нпдч])\./g,"$1т. $2.").r(/ н\. э\./g," н. э").r(/([№§]) ?([\dIVXLCDM])/g,"$1 $2").r(/(\d)([lpd]pi)([\s,\.!?]|$)/g,"$1 $2"+"$3").r(/ГОСТ /gi,"ГОСТ ").r(/ГОСТ Р /gi,"ГОСТ Р ").r(/([\s]|^)до[  ]нэ\./g,"$1до н. э.");
				a=a.r(/ {2,}/g," ");
				//;.r(/(\,|!|\?)([^\d\n=?:,\.'’"»“”\[]+)/gi,"$1 $2");
				//.r(/([^^\n] {0,2})? {2,}/g,"$1 ")
				//a=a.r(/ /g," ");
				//var sp='(к|с|у|о|в|до|из|но|на|по|от|об|за|при|над|под|про|для|без|перед|через|и|а|да|или|либо|зато|однако|чтобы|едва|ибо|пока|кол[иь]|пусть)';
				/** Простановка неразрывного пробела после предлогов, союзов **/
				for(var i=0;i<2;++i){
					a=a.r(/([  \n\t\v]|^)([иаксуов]|же|до|из|н[аое]|по|о[тб]|за|как|что|над|под|пр[ои]|или|для|без|если|едва|л?ибо|зато|пока|дабы|ежели|когда|перед|чтобы|через|пусть|будто|однако|словно) ([А-яёЁ])/gi,"$1"+"$2 $3");
				}
			}
			/** Табуляция **/
			a=a.r(/(\n|^)[  \t]+/g,"$1");
			if(t("tabs")){
				if(TYPO.type=="norm"){
					a=a.r(/(\n)([^\s])/g,"$1    $2").r(/(^|\n) +/g,"$1    ").r(/(\n|^) +\n/g,"$1\n");
					if(typobegin){
						a=a.r(/(^)([^\s])/g,"$1    $2");
					}
				}
			}
			/** Тире, дефисы **/
			if(t("dashs")){
				if(TYPO.language!="eng"){
					//a=a.r(/([A-Za-zА-яёЁ]+)(—|–)([A-Za-zА-яёЁ]+)/gi,"$1-$3");
					a=a.r(/(\s|^|<p>)([«"„‚]*)(-|–)([\s]|$)/g, "$1"+"$2—$4");
					a=a.r(/([A-Za-zА-яёЁ0-9]) —/g, "$1 —");
					a=a.r(/([\.,!?] |\n|^|<p>)— ([A-Za-zА-яёЁ0-9«"„‚])/g, "$1— $2");
					//Расстановка дефисов
					var mst="(где|зачем|как|какая|каки[емх]|како[ейм]|какого|какому|кем|когда|кого|кому?|кто|куда|откуда|почему|чего|чему?|что|ч[её]м)";
					a=a.r(r("([^А-яёЁ]|^)"+mst+"(?:[  ]?|-[  ]|[  ]-)(то|либо|нибудь)([^А-яёЁ]|$)","gi"),"$1"+"$2-$3"+"$4").r(r("([^А-яёЁ]|^)"+mst+"(?:[  ]?|-[  ]|[  ]-)(то|либо|нибудь)([^А-яёЁ]|$)","gi"),"$1"+"$2-$3"+"$4").r(r("([^А-яёЁ]|^)(кое|кой)(?:[  ]?[-—]?[  ]?)"+mst+"([^А-яёЁ]|$)","gi"),"$1"+"$2-$3"+"$4").r(r("([^А-яёЁ]|^)(ко[ей])(?:[  ]?[-—]?[  ]?)"+mst+"([^А-яёЁ]|$)","gi"),"$1"+"$2-$3"+"$4").r(/([\s]|^)(из)(?:[  ]?[-—]?[  ]?)(за)([\s]|$)/gi,"$1"+"$2-$3"+"$4").r(/([\s]|^)(из)(?:[  ]?[-—]?[  ]?)(под)([\s]|$)/gi,"$1"+"$2-$3"+"$4").r(/([А-яёЁ]{2,}) (ка|кась)([\s,\.\?!]|$)/g,"$1-$2"+"$3").r(/([^А-яёЁ]|^)(вс[ёе]|так)(?:[  ]?|-[  ]|[  ]-)(таки)([^А-яёЁ]|$)/gi,"$1"+"$2-$3"+"$4").r(/(ГОСТ(?:[  ]Р)?(?:[  ](?:ИСО|ISO))?)[  ]([\d\.]+)-([\d]+)/gi,"$1 $2–$3");
					//Расстановка тире в датах
					a=a.r(/([IVXLCDM]{1,3})-([IVXLCDM]{1,3})[  ]?вв?\.?([\s\.,?!;\)])/g,"$1—$2 вв.$3").r(/([\d]{1,4})-([\d]{1,4})[  ]?гг?\.([\s\.,?!;\)])/g,"$1–$2 гг.$3").r(/([^\d]|^)([0-2][0-9]:[0-5][0-9])-([0-2][0-9]:[0-5][0-9])([^\d]|$)/g,"$1"+"$2–$3"+"$4")/*.r(/(\s|^)([IVXLСDМ]+)-{1,2}([IVXLСDМ]+)(\s|$)/g,"$1"+"$2—$3"+"$4")*/;
					var mo="(?:[ьяюе]|[её]м)";
					var to="(?:[ауе]|ом)";
					var month="(январ"+mo+"|феврал"+mo+"|март"+to+"|апрел"+mo+"|ма(?:[йяюе]|ем)|ию[нл]"+mo+"август"+to+"|сентябр"+mo+"|ноябр"+mo+"|октябр"+mo+"|декабр"+mo+")";
					a=a.r(r("([\\s]|^)([1-3]?[\\d])-([1-3]?[\\d])[  ]?"+month+"([^А-яёЁ]|$)","gi"), "$1"+"$2–$3 $4"+"$5").r(r("([^А-яёЁ]|^)"+month+"-"+month+"([^А-яёЁ]|&)","gi"),"$1"+"$2—$3"+"$4");
				}
				a=a.r(/(\d)--(\d)/g, '$1–$2').r(/([^-]|\s|^)--([^-]|$|\n)/g, '$1—$2').r(/([^-\d]|^)(\d+)-(\d+)([^-\d]|$)/g,"$1"+"$2−$3"+"$4").r(/([^a-z][a-z]|[Α-Ωα-ω+=*\/])-(\d)/g,"$1−$2")/*.r(/([A-Za-z\s]|^)-(\d+)([^-\d]|$)/g,"$1"+sym[20]+"$2"+"$3").r(/([^-\d]|^)(\d+)-([A-Za-z])/g,"$1"+"$2"+sym[20]+"$3")*/;
			};
			/** Замена прочих символов **/
			if(t("chars")){
				//Не заменяю ... на … из практических соображений: ?.. !.. ?!.
				a=a.r(/…/g,"...").r(/([^\.])\.{2,4}/g,"$1...").r(/(\?!|!\?)\.{3}/g,"?!.").r(/\?\.{3}/g,"?..").r(/!\.{3}/g,"!..").r(/(!+)(\?+)/g,"$2"+"$1").r(/(\d+?)[xх](\d+?)/g,"$1×$2").r(/(\d+?)([  ])[xх]([  ])(\d+?)/g,"$1×$4").r(/([0-9a-zA-ZΑ-Ωα-ωА-яёЁ])\^([0-9]+)/g,function($0,$1,$2){
					var l="0123456789", g="⁰¹²³⁴⁵⁶⁷⁸⁹";
					var re=$2;
					for(var j=0;j<10;++j){
						re=re.r(r(l.charAt(j),"g"),g.charAt(j));
					}
					return $1+re
				}).r(/!=/g,"≠").r(/\+\/[\-−]/g,"±").r(/~=/g,"≈").r(/<=/g,"≤").r(/>=/g,"≥").r(/<->/g,"↔").r(/<-([^-]|&)/g,"←$1").r(/([^-]|^)->/g,"$1→").r(/(!+)(\?+)/g,"$2"+"$1").r(/\?{3,}/g,"???").r(/!{3,}/g,"!!!");
				//Дроби
				var t1="([^0-9A-Za-zА-яёЁ\/]|^)",t2="([^0-9A-Za-zА-яёЁ\/]|$)";
				a=a.r(r(t1+"1\/2"+t2,"g"),"$1½$2").r(r(t1+"1\/4"+t2,"g"),"$1¼$2").r(r(t1+"2\/4"+t2,"g"),"$1½$2").r(r(t1+"3\/4"+t2,"g"),"$1¾$2").r(r(t1+"1\/3"+t2,"g"),"$1⅓$2").r(r(t1+"2\/3"+t2,"g"),"$1⅔$2").r(r(t1+"1\/5"+t2,"g"),"$1⅕$2").r(r(t1+"2\/5"+t2,"g"),"$1⅖$2").r(r(t1+"3\/5"+t2,"g"),"$1⅗$2").r(r(t1+"4\/5"+t2,"g"),"$1⅘$2").r(r(t1+"1\/6"+t2,"g"),"$1⅙$2").r(r(t1+"2\/6"+t2,"g"),"$1⅓$2").r(r(t1+"3\/6"+t2,"g"),"$1½$2").r(r(t1+"4\/6"+t2,"g"),"$1⅔$2").r(r(t1+"5\/6"+t2,"g"),"$1⅚$2").r(r(t1+"1\/8"+t2,"g"),"$1⅛$2").r(r(t1+"2\/8"+t2,"g"),"$1¼$2").r(r(t1+"3\/8"+t2,"g"),"$1⅜$2").r(r(t1+"4\/8"+t2,"g"),"$1½$2").r(r(t1+"5\/8"+t2,"g"),"$1⅝$2").r(r(t1+"6\/8"+t2,"g"),"$1¾$2").r(r(t1+"7\/8"+t2,"g"),"$1⅞$2").r(/,+/g,",").r(/:+/g,":").r(/;+/g,";").r(/([a-zA-ZА-яёЁ0-9]) (а|но)([\s$,]|\.\.\.)/g, "$1, $2"+"$3").r(/([a-zA-ZА-яёЁ0-9]) однако([\s$,\.!?:])/g, "$1, однако"+"$2");
				a=a.r(/([^a-zА-яёЁ]|^)([a-zА-яёЁ]+)[  ](\2)([^a-zA-ZА-яёЁ]|$)/gi,"$1"+"$2"+"$4")
			};
			//a=a.r(/(http|ftp|sttp|javascript)\: ([^,]+?)/gi,"$1:$2").r(/(href|src)="([^"]+?)"|/g,function(a,b,c){return a.r(/ ?/g,"")});
			/** Расстановка кучерявых кавычек **/
			if(t("quotes")){
				/*.r(/«|»|”|“|„/g,'"')*/
				/** Предварительная расстановка «ёлочек» **/
				a=a.r(/(^|\n|\s|—|-|\()"/g,"$1«").r(/"($|\n|\s|—|-|\.|,|!|\?|:|;|\))/g,"»$1").r(/«\)/g,"»)").r(/«( ?)/g,"«").r(/( ?)»/g,"»").r(/>"/g,">«").r(/"</g,"»<").r(/«""/g,"«««").r(/«"/g,"««").r(/""»/g,"»»»").r(/"»/g,"»»").r(/("{2}|"»)/g,"»»").r(/$"/g,"«").r(/([A-Za-zа-яА-ЯёЁ])'/g,"$1’");
				a=a.r(/[a-zA-ZА-яёЁ]"-/g,"$1»-").r(/-"[a-zA-ZА-яёЁ]/g,"-«$1");
				//Добиваем оставшиеся кавычки как можем
				a=a.r(/(^[^«»]*)"/g,"$1«").r(/"([^«»]*$)/g,"»$1").r(/«([^«»]*)"/g,"«$1»").r(/"([^«»]*)»/g,"«$1»");
				/** Замена вложенных «ёлочек» и „лапок“ на „лапки“ и ‚коготки‘ **/
				if(TYPO.language!="eng"){
					function rl(i,j){//replace_leveled
						var b="",c,d="";
						if(i!=0){
							b=a.substring(0, i);
						}
						if(j!=a.length-1){
							d=a.substring(j+1, a.length);
						}
						c=a.substring(i,j+1);
						for(var i=0;i<32;++i){
							c=c.r(/«([^«»]*)«([^»]*)»/g,"«$1„$2“");
							if(t("claw")){
								c=c.r(/„([^„“]*)„([^“]*)“/g,"„$1‚$2‘");
							}
						}
						return b+c+d;
					};
					var level=0;
					for(var i=0;i<a.length;++i){
						if (a.charAt(i)=='«'){
							++level;
							for(var j=i+1;j<a.length;++j){
								if (a.charAt(j)=='«'){
									++level;
								}		
								if(a.charAt(j)=='»'){
									--level;
									if(level<=0){
										a=rl(i,j);
										i=j;
										break;
									}
								}
							}
							level=0;
						}
					}
				}
				else{
					a=a.r(/'([A-Za-zа-яА-ЯёЁ])/g,"‘$1");
				}
			}
			/** Преобразование в формат HTML **/
			if(TYPO.type=="html"){
				/** Замена <> на &lt; &gt; **/
				if(t("chars")){
					a=a.r(/<(?!\/?[A-Za-z][^\n$<>]*>|!--)/g,"&lt;").r(/(<\/?[A-Za-z][^\n$<>]*|--)?>/g,function($0,$1){return $1?$0:"&gt;"});
				}
				/** Параграфы **/
				if(t("tabs")){
					a=a.r(/(\n)(?!<p>)([^\n]*)(?!<\/p>)(\n)/g,"$1<p>$2</p>$3").r(/(\n)(?!<p>)([^\n]*)(?!<\/p>)(\n)/g,"$1<p>$2</p>$3").r(/ +<\/p>(\n)/g,"</p>$1");
					if(typobegin){
						a=a.r(/(^)(?!<p>)([^\n]*)(?!<\/p>)(\n)/g,"$1<p>$2</p>$3");
						if(typoend){
							a=a.r(/(^)(?!<p>)([^\n]*)(?!<\/p>)($)/g,"$1<p>$2</p>$3");
						}
					}
					if(typoend){
						a=a.r(/(\n)(?!<p>)([^\n]*)(?!<\/p>)($)/g,"$1<p>$2</p>$3").r(/ +<\/p>(\n|$)/g,"</p>$1");
					}
					a=a.r(/<p>(UNTYPO[\d]+)<\/p>/g,"$1");
					a=a.r(/<p><\/p>/g,"").r(/<p>(UNTYPO[\d]+S)<\/p>/g,"$1");
					a=a.r(/<p>(.*?<\/?)([uo]l|li)(>.*?)<\/p>/g,"$1$2$3");
				}
				/** Заголовки **/
				if(t("h1")){
					var po=t("tabs")?"<p>":"";
					var pc=t("tabs")?"</p>":"";
					a=a.r(r("(\n|^)"+po+"([А-яёЁa-zA-Z0-9\"«“][^\n]{1,50}[А-яёЁa-zA-Z0-9\"»”\)])"+pc+"(\n|$)","g"),"$1<h1>$2</h1>$3").r(/<h1>([^а-яА-ЯёЁa-zA-Z§]+?)<\/h1>/g,po+"$1"+pc).r(r("(\n|^)"+po+"(Глава|Chapter|Section|§)([  ]?[IVXLСDМ0-9][^\n]{0,43})"+pc+"(\n|$)","g"),"$1<h1>$2$3</h1>$4").r(r("(\n|^)"+po+"(Эпилог|Пролог|Epilogue|Prologue)(\.?)"+pc+"(\n|$)","g"),"$1<h1>$2$3</h1>$4").r(/<h1>(UNTYPO[\d]+S)<\/h1>/g,"$1");
				}
				if(t("nbsp")){
					a=a.r(/([А-яёЁa-zA-Z0-9]+)((?:-[А-яёЁa-zA-Z0-9]+)+)/g, "<nbsp>$1$2</nbsp>");
				}
			}
			/** Английские кавычки **/
			if(TYPO.language=="eng"){
				a=a.r(/«/g,"“").r(/»/g,"”");
			};
			/** Удаление неразрывных пробелов **/
			if(!t("nbsp")){
				a=a.r(/ /g," ");
			}
			/** Замена переносов на <br /> **/
			if(t("br")){
				a=a.r(/\n/g,"<br />");
			}
			a=a.r(/ (\))/g,"$1")/*.r(/(н\. э|т\. д|т\. д|т \. п|т \.к|г \.|\. т \. д)/g,function(a,b){return b.r(/ /g," ")})*/;
			/** Преобразование обычных символов в коды **/
			if(TYPO.type=="html"){
				for(var i=0;i<normsym.length;++i){
					a=a.r(r(normsym[i],"g"),"&"+htmlsym[i]+";");
				}
			}
			/** Разэкранирование **/
			for(var i=m.length-1;i>=0;--i){
				a=a.r("UNTYPO"+i+"S",/*"<"+tag+">"+*/m[i]/*+"</"+tag+">"*/)
			};
			a=a.r(r("(<\\/?"+tag+">)+","g"),"$1");
			return a;
		};
		/** Привязка типографа **/
		if(TYPO.bind){
			var i;
			if(TYPO.obj){
				i=arrayEditor(i,TYPO.obj);
			}else{
				return 0;
			}
			i=typof(i,"object")?i:[i];
			for(var o in i){
				i[o]=typof(i[o],"string")?id(i[o]):i[o];
				if(i[o]){
					removeEvent(i[o],TYPO.bind,init);
					addEvent(i[o],TYPO.bind,init);
				}
			}
			if(t("tabs")){
				if(TYPO.nbspobj){
					i=arrayEditor(i,TYPO.nbspobj);
					i=typof(i,"object")?i:[i];
					for(var o in i){
						i[o]=typof(i[o],"string")?id(i[o]):i[o];
						if(i[o]){
							removeEvent(i[o],TYPO.bind,r2Tabs);
							addEvent(i[o],TYPO.bind,r2Tabs);
						}
					}
				};
			}
		}
	}
}
)();