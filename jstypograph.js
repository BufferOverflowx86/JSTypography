/*!
 * JS Typograph
 * The Javascript Typography Correcter
 *
 * @version   3.0.1
 * @author    «BufferOverflow»
 * @copyright Данил Ерошенко «BufferOverflow» <buffer.overflow.x86 at gmail dot com>
 * @link      https://github.com/BufferOverflowx86/JSTypography3
 * @license   MIT; https://opensource.org/licenses/MIT
 */

(function () {
    if (!Array.indexOf) {	//IE must die
        Array.prototype.indexOf = function (obj) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == obj) {
                    return i;
                }
            }
            return -1;
        }
    }

    // Укороченная запись "".replace
    if (!String.r) {
        String.prototype.r = String.prototype.replace
    }

    // Укороченная запись new RegExp()
    var r = function (text, regex) {
        return new RegExp(text, regex)
    };

    var jstypo = {
        protectStack: [],
        defaultConfig: {
            mode: 'text', // text, forum, html
            br: false,
            chars: true,
            tabs: true,
            quotes: true,
            quotesLevel: 2,
            lang: "rus",
            href: true,
            functions: true,
            spaces: true,
            dashs: true,
            h1: true,
            nbsp: true,
            clearUntypo: false,
            nbsptabs: false
        },

        fixConfig: function (config) {
            return Object.assign(this.defaultConfig, config);
        },

        protect: function (config, text) {
            s = text.match(r("<untypoX?>[\\s\\S]+?</untypoX?>", "g"));
            var i = 0;
            if (s) {
                for (; i < s.length; i++) {
                    text = text.r(s[i], "✁UNTYPO" + this.protectStack.length + "S✃")
                    this.protectStack.push(s[i]);
                }
            }

            return text;
        },

        unprotect: function (config, text) {
            while (this.protectStack.length > 0) {
                var value = this.protectStack.pop().r(r("<\\/?untypoX>", "g"), "");
                var replacement;
                if (config.clearUntypo) {
                    replacement = value.r(r("<\\/?untypo>", "g"), "")
                } else {
                    replacement = value;
                }

                text = text.r("✁UNTYPO" + this.protectStack.length + "S✃", replacement)
            };

            return text;
        },

        typographySelection: function(config, field) {
            typobegin = true;
            typoend = true;
            var txt = '', typotext;

            var textScroll = field.scrollTop;
            if (field && field.value && field.selectionStart != undefined) {
                var startPos = field.selectionStart;
                var endPos = field.selectionEnd;
                txt = field.value.substring(startPos, endPos);
                if (txt == '') {
                    field.value = this.typographyText(config, field.value, typobegin, typoend);
                } else {
                    if (startPos != 0) {
                        if (field.value.charAt(startPos - 1) != '\n' && field.value.charAt(startPos - 1) != '\r') {
                            typobegin = false;
                        }
                    }
                    if (endPos != field.value.length) {
                        if (field.value.charAt(endPos) != '\n' && field.value.charAt(endPos) != '\r') {
                            typoend = false;
                        }
                    }
                    typotext = this.typographyText(config, txt, typobegin, typoend);
                    field.value = field.value.substring(0, startPos) + typotext + field.value.substring(endPos);
                }
            } else if (document.selection && document.selection.createRange) { //IE must die
                var range = document.selection.createRange();
                txt = range.text;
                if (txt == '') {
                    field.value = this.typographyText(config, field.value, typobegin, typoend);
                } else {
                    typobegin = false;
                    typoend = false;
                    typotext = this.typographyText(config, txt, typobegin, typoend);
                    range.text = typotext;
                }
            } else { // other browsers
                field.value = this.typographyText(config, field.value, typobegin, typoend);
            }
            field.scrollTop = textScroll;
        },

		// Типографическая обработка текста
        typographyText: function (config, text, typobegin, typoend) {
            if (typobegin == null) {
                typobegin = true;
            }

            if (typoend == null) {
                typoend = true;
            }

			var s,
                w,
                isForum = config.mode.indexOf("forum") != -1,
                isHtml = config.mode.indexOf("html") != -1;

            // Используемые символы
			var normsym=["—",		"«",		"»",		"…",		"©",		"®",		"™",		"←",		"→",		"↑",		"↓",		"↔",		"°",		"́",			"×",		"≠",		"±",		"↕",		"‘",		"’",		"−",		"–",		"“",		"”",		"„",		"≥",		"≤",		"§",		"€",		"£",		"″",		"√",		"∫",		"½",		"¼",		"¾",		" ",		"‚",		"¹",		"²",		"³",		"⅓",		"⅔",		"⅕",		"⅖",		"⅗",		"⅘",		"⅙",		"⅚",		"⅛",		"⅜",		"⅝",		"⅞",		"≈",		'"',		"⁰",		"⁴",		"⁵",		"⁶",		"⁷",		"⁸",		"⁹",		"⁺",		"⁻",		"⁼",		"⁽",		"⁾",		"ⁿ",		"ⁱ",		"₀",		"₁",		"₂",		"₃",		"₄",		"₅",		"₆",		"₇",		"₈",		"₉",		"₊",		"₋",		"₌",		"₍",		"₎"];
			var htmlsym=["mdash",	"laquo",	"raquo",	"hellip",	"copy",		"reg",		"trade",	"larr",		"rarr",		"uarr",		"darr",		"harr",		"deg",		"#769",		"times",	"ne",		"plusmn",	"#8597",	"lsquo",	"rsquo",	"minus",	"ndash",	"ldquo",	"rdquo",	"bdquo",	"ge",		"le",		"sect",		"euro",		"pound",	"Prime",	"radic",	"int",		"frac12",	"frac14",	"frac34",	"nbsp",		"sbquo",	"sup1",		"sup2",		"sup3",		"#8531",	"#8532",	"#8533",	"#8534",	"#8535",	"#8536",	"#8537",	"#8538",	"#8539",	"#8540",	"#8541",	"#8542",	"#8776",	"quot",		"#8304",	"#8308",	"#8309",	"#8310",	"#8311",	"#8312",	"#8313",	"#8314",	"#8315",	"#8316",	"#8317",	"#8318",	"#8319",	"#8305",	"#8320",	"#8321",	"#8322",	"#8323",	"#8324",	"#8325",	"#8326",	"#8327",	"#8328",	"#8329",	"#8330",	"#8331",	"#8332",	"#8333",	"#8334"];
			//	         0			1			2			3			4			5			6			7			8			9			10			11			12			13			14			15			16			17			18			19			20			21			22			23			24			25			26			27			28			29			30			31			32			33			34			35			36			37			38			39			40			41			42			43			44			45			46			47			48			49			50			51			52			53			54			55			56			57			58			59			60			61			62			63			64			65			66			67			68			69			70			71			72			73			74			75			76			77			78			79			80			81			82			83

            // Регулярки на имейлы и ссылки
            var RegLink = r('([  \n\t\v]|^)(((ht|f)tps?://)?([\\-\\w]+:[\\-\\w]+@)?([0-9a-z][\\-0-9a-z]*[0-9a-z]\\.)+[a-z]{2,6}(:\\d{1,5})?([?/\\\\#][?!^$.(){}:|=[\\]+\\-/\\\\*;&~#@,%\\wА-Яа-я]*)?)([  \n\t\v]|$)', "gi");
            var RegMail = r("([  \n\t\v]|^)([\\-a-z0-9!#$%&'*+\\/=?^_`{|}~]+(\\.[\\-a-z0-9!#$%&'*+\\/=?^_`{|}~]+)*@([a-z0-9]([\\-a-z0-9]{0,61}[a-z0-9])?\.)*([a-z]{2,6}))([  \n\t\v]|$)", "gi");

            text = text.r(/(\r\n|\r)/g, "\n");

            // Экранирование тэгов, кодов, цитат и т.п.
            if (isForum) {
                text = text.r(/(\[code[^\]$\n]*\\]|\[quote[^\]$\n]*\]|\[img\])/g, "<untypoX>" + "$1").r(/(\[\/code\]|\[\/quote\]|\[\/img\])/g, "$1" + "</untypoX>").r(/(\[url[^\[\]]+?\])/g, "<untypoX>" + "$1" + "</untypoX>");
            }

            // Экранирование html-тегов
            if (isHtml) {
                text = text.r(/(<pre[^<>]*?>)/g, "<untypoX>" + "$1").r(/(<\/pre>)/g, "$1" + "</untypoX>").r(/(<script[^<>]*?>|<style[^<>]*?>)/g, "<untypoX>" + "$1").r(/(<\/script>|<\/style>)/g, "$1" + "</untypoX>").r(/(<!--(.|\n)*?-->)/g, "<untypoX>" + "$1" + "</untypoX>").r(/(="[^"\n\r]*")/g, "<untypoX>" + "$1" + "</untypoX>")
            }

            // Удаление вложенных <untypo>
            for (var i = 0; i < 10; ++i) {
                text = text.r(r("(<untypoX>)([\\s\\S]*?)(<\\/?untypoX>)", "g"), function ($0, $1, $2, $3) {
                    if ($3.charAt(1) != '/') {
                        return $1 + $2;
                    }
                    else {
                        return $0;
                    }
                });
                text = text.r(r("(<\\/untypoX>)([\\s\\S]*?)(<\\/?untypoX>)", "g"), function ($0, $1, $2, $3) {
                    if ($3.charAt(1) == '/') {
                        return $2 + $3;
                    }
                    else {
                        return $0;
                    }
                });
            }

            // Экранирование
            text = this.protect(config, text);
            // Обработка ссылок
            if (isHtml && config.href) {
                for (var i = 0; i < 2; ++i) {
                    text = text.r(RegLink, '$1<untypoX><a href="$2">$2</a></untypoX>$9');
                    text = text.r(RegMail, '$1<untypoX><a href="mailto:$2">$2</a></untypoX>$7');
                }
            }
            else {
                // ссылки просто экранируются
                for (var i = 0; i < 2; ++i) {
                    text = text.r(RegLink, "$1<untypoX>" + "$2" + "</untypoX>$9").r(RegMail, "$1<untypoX>" + "$2" + "</untypoX$7");
                }
            }

            text = this.protect(config, text);

            // Замена html символов на обычные
            for (var i = 0; i < htmlsym.length; ++i) {
                text = text.r(r("&" + htmlsym[i] + ";", "g"), normsym[i]);
            }

            // замена <br> на перенос
            if (config.br) {
                text = text.r(/<br( *[^\n>]*?)?\/?>/gi, "\n");
            }

            // удаление параграфов и заголовков
            text = text.r(/<\/?p>/gi, "");
            text = text.r(/<\/?h1>/gi, "");
            text = text.r(/<\/?nbsp>/gi, "");

            // замена символов © ® ™
            if (config.chars) {
                text = text.r(/\(c\)/g, "©").r(/\(r\)/g, "®").r(/\(tm\)/g, "™");

                if (!isHtml) {
                    text = text.r(/&lt;/g, "<").r(/&gt;/g, ">");
                }

                // Не заменяю ... на … из практических соображений: ?.. !.. ?!.
                text = text.r(/…/g, "...");
            }

            // Замена всех кучерявых кавычек на обычные
            if (config.quotes) {
                text = text.r(/«|»|”|“|„/g, '"');

                if (config.lang != "eng") {
                    text = text.r(/‚|‘/g, '"');
                }
            }

            // Обработка функций
            if (config.functions) {
                var q = function (a, b, c) {
                    var l = "ABGDEZHJIKLMNQCOPRSTYUFXVWabgdezhjiklmnqcoprstyufxvw", g = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΞΟΠΡΣΤΥΥΦΧΨΩαβγδεζηθικλμνξξοπρστυυφχψω";
                    for (var i = 0; i < 52; ++i) {
                        if (c == l.charAt(i)) {
                            return g.charAt(i);
                        }
                    }
                    return '?';
                };

                text = text.r(/(УДАР|ACNT)\(([\wА-яёЁ]?)\)/g, "$2́").r(/(СТРЛ|ARRW)\(([\wА-яёЁ]+?)\)/g, function (b, c, a) { return a == "В" || a == "U" ? "↑" : a == "Н" || a == "D" ? "↓" : a == "Л" || a == "L" ? "←" : a == "П" || a == "R" ? "→" : a == "ЛП" || a == "LR" ? "↔" : a == "ВН" || a == "UD" ? "↕" : b });
                text = text.r(/(ГРАД|DEGR)\(([0-9\.]*)\)/g, "$2°").r(/(ПАРА|SECT)\(([IVXLСDМ0-9]*)\)/g, "§ $2").r(/(ЕВРО|EURO)\(([0-9\.]*)\)/g, "$2€").r(/(ФУНТ|PUND)\(([0-9\.]*)\)/g, "$2£").r(/(ДЮЙМ|INCH)\(([0-9\.]*)\)/g, "$2″").r(/(КОРН|SQRT)\(([\w0-9]*)\)/g, "√$2").r(/(ИНТГ|INTG)\(([\w0-9]*)\)/g, "∫$2").r(/(ГРЕЧ|GREK)\(([A-Za-z])\)/g, q);
                s = text.match(/(ВЕРХ|SUPS)\[([0-9+\-=\(\)ni]+)\]/g);
                if (s) {
                    for (var i = 0; i < s.length; ++i) {
                        var l = "0123456789-=ni", g = "⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁼ⁿⁱ";
                        var re = s[i].r(/(ВЕРХ|SUPS)\[([0-9+\-=\(\)ni]+)\]/g, "$2");
                        for (var j = 0; j < 14; ++j) {
                            re = re.r(r(l.charAt(j), "g"), g.charAt(j));
                        }
                        re = re.r(/\+/g, '⁺').r(/\(/g, '⁽').r(/\)/g, '⁾');
                        text = text.r(s[i], re);
                    }
                }
                s = text.match(/(НИЖН|SUBS)\[([0-9+\-=\(\)]+)\]/g);
                if (s) {
                    for (var i = 0; i < s.length; ++i) {
                        var l = "0123456789-=", g = "₀₁₂₃₄₅₆₇₈₉₋₌";
                        var re = s[i].r(/(НИЖН|SUBS)\[([0-9+\-=\(\)]+)\]/g, "$2");
                        for (var j = 0; j < 12; ++j) {
                            re = re.r(r(l.charAt(j), "g"), g.charAt(j));
                        }
                        re = re.r(/\+/g, '₊').r(/\(/g, '₍').r(/\)/g, '₎');
                        text = text.r(s[i], re);
                    }
                }

            };

            // TODO: ... Когда В. И. Пупкин
            // Простановка пробелов и nbsp
            if (config.spaces) {
                if (typobegin) {
                    text = text.r(/(^)[ \t]+/g, "$1");
                }

                text = text.r(/([\d]) ?(€|£|л\.|[скм]?м[\/\^¹²³\.\s]|г[аг]?[\s\.]|ц\.|т[\s\.]|р\.|руб\.|уе|тыс\.|млн|млрд)/g, "$1 $2").r(/([\d]) г\.[  ]?г\./g, "$1 гг.").r(/([IVXLCDM]) ?(вв?\.)/g, "$1 $2").r(/([IVXLCDM]) в\.[  ]?в\./g, "$1 вв.");
                text = text.r(/([^\d]|^)([\d]+(?:[\.,][\d]+)?) ?\$/g, "$1$$$2").r(/(\,|;|:|!|\?|\))([^\d\s=?!:,\.'’‘‚"«»“”\[])/gi, "$1 $2").r(/(\[color=[^\n]*\])( | )( | )( | )( | )/g, "$2" + "$3" + "$4" + "$5" + "$1").r(/ {2,}/g, " ").r(/\.([^\s\dA-Za-z\n=?:;,\.'’‘"»„“”\[]+)/gi, ". $1").r(/([А-яёЁ])\.([^\sA-Za-z\n=?:;,\.'’‘"»„“”\[]+)/g, "$1. $2").r(/ (\.|,|!|\?|;|:)/g, "$1").r(/(—|–|-)\.{2,4} /g, "$1 ...").r(/(\n|^|&)( *)\.{2,4} /g, "$1" + "$2...").r(/(['‘‚"«„“\(])\.{2,4} /g, "$1...").r(/(\s|^)\.{2,4}[  ]/g, "$1...").r(/\( /g, "(").r(/ \)/g, ")").r(/([^\s])\(/g, "$1 (").r(/([^\d])(,|\.)([\d])/g, "$1" + "$2 $3").r(/(!|\?|\))([^\s=?!:,\.'’‘‚"«»“”\[]+)/gi, "$1 $2").r(/ %/g, "%").r(/P\. ?P\. ?S\./g, "P. P. S.").r(/P\. ?S\./g, "P. S.").r(/и др\./g, "и др.").r(/([\s]|^)(гл?|ул|д|илл)\. ([A-Za-zА-яёЁ0-9])/g, "$1" + "$2. $3").r(/(\s|^)([тнсюзв])\. ?([еочнпдшдэ])\./g, "$1" + "$2. $3.").r(/(\s|^)т\.? ?([нпдч])\./g, "$1т. $2.").r(/ н\. э\./g, " н. э").r(/([№§]) ?([\dIVXLCDM])/g, "$1 $2").r(/(\d)([lpd]pi)([\s,\.!?]|$)/g, "$1 $2" + "$3").r(/ГОСТ /gi, "ГОСТ ").r(/ГОСТ Р /gi, "ГОСТ Р ").r(/([\s]|^)до[  ]нэ\./g, "$1до н. э.");
                text = text.r(/ {2,}/g, " ");

                // Простановка неразрывного пробела после предлогов, союзов
                for (var i = 0; i < 2; ++i) {
                    text = text.r(/([  \n\t\v]|^)([иаксуов]|же|до|из|н[аое]|по|о[тб]|за|как|что|над|под|пр[ои]|или|для|без|если|едва|л?ибо|зато|пока|дабы|ежели|когда|перед|чтобы|через|пусть|будто|однако|словно) ([А-яёЁ])/gi, "$1" + "$2 $3");
                }
            }

            text = text.r(/(\n|^)[  \t]+/g, "$1");
            if (config.tabs) {
                if (!isHtml) {
                    text = text.r(/(\n)([^\s])/g, "$1    $2").r(/(^|\n) +/g, "$1    ").r(/(\n|^) +\n/g, "$1\n");
                    if (typobegin) {
                        text = text.r(/(^)([^\s])/g, "$1    $2");
                    }
                }
            }

            // Тире, дефисы
            if (config.dashs) {
                if (config.lang == "rus") {
                    text = text.r(/(\s|^|<p>)([«"„‚]*)(-|–)([\s]|$)/g, "$1" + "$2—$4");
                    text = text.r(/([A-Za-zА-яёЁ0-9]) —/g, "$1 —");
                    text = text.r(/([\.,!?] |\n|^|<p>)— ([A-Za-zА-яёЁ0-9«"„‚])/g, "$1— $2");

                    // Расстановка дефисов
                    var mst = "(где|зачем|как|какая|каки[емх]|како[ейм]|какого|какому|кем|когда|кого|кому?|кто|куда|откуда|почему|чего|чему?|что|ч[её]м)";
                    text = text.r(r("([^А-яёЁ]|^)" + mst + "(?:[  ]?|-[  ]|[  ]-)(то|либо|нибудь)([^А-яёЁ]|$)", "gi"), "$1" + "$2-$3" + "$4").r(r("([^А-яёЁ]|^)" + mst + "(?:[  ]?|-[  ]|[  ]-)(то|либо|нибудь)([^А-яёЁ]|$)", "gi"), "$1" + "$2-$3" + "$4").r(r("([^А-яёЁ]|^)(кое|кой)(?:[  ]?[-—]?[  ]?)" + mst + "([^А-яёЁ]|$)", "gi"), "$1" + "$2-$3" + "$4").r(r("([^А-яёЁ]|^)(ко[ей])(?:[  ]?[-—]?[  ]?)" + mst + "([^А-яёЁ]|$)", "gi"), "$1" + "$2-$3" + "$4").r(/([\s]|^)(из)(?:[  ]?[-—]?[  ]?)(за)([\s]|$)/gi, "$1" + "$2-$3" + "$4").r(/([\s]|^)(из)(?:[  ]?[-—]?[  ]?)(под)([\s]|$)/gi, "$1" + "$2-$3" + "$4").r(/([А-яёЁ]{2,}) (ка|кась)([\s,\.\?!]|$)/g, "$1-$2" + "$3").r(/([^А-яёЁ]|^)(вс[ёе]|так)(?:[  ]?|-[  ]|[  ]-)(таки)([^А-яёЁ]|$)/gi, "$1" + "$2-$3" + "$4").r(/(ГОСТ(?:[  ]Р)?(?:[  ](?:ИСО|ISO))?)[  ]([\d\.]+)-([\d]+)/gi, "$1 $2–$3");

                    // Расстановка тире в датах
                    text = text.r(/([IVXLCDM]{1,3})-([IVXLCDM]{1,3})[  ]?вв?\.?([\s\.,?!;\)])/g, "$1—$2 вв.$3").r(/([\d]{1,4})-([\d]{1,4})[  ]?гг?\.([\s\.,?!;\)])/g, "$1–$2 гг.$3").r(/([^\d]|^)([0-2][0-9]:[0-5][0-9])-([0-2][0-9]:[0-5][0-9])([^\d]|$)/g, "$1" + "$2–$3" + "$4")/*.r(/(\s|^)([IVXLСDМ]+)-{1,2}([IVXLСDМ]+)(\s|$)/g,"$1"+"$2—$3"+"$4")*/;
                    var mo = "(?:[ьяюе]|[её]м)";
                    var to = "(?:[ауе]|ом)";
                    var month = "(январ" + mo + "|феврал" + mo + "|март" + to + "|апрел" + mo + "|ма(?:[йяюе]|ем)|ию[нл]" + mo + "август" + to + "|сентябр" + mo + "|ноябр" + mo + "|октябр" + mo + "|декабр" + mo + ")";
                    text = text.r(r("([\\s]|^)([1-3]?[\\d])-([1-3]?[\\d])[  ]?" + month + "([^А-яёЁ]|$)", "gi"), "$1" + "$2–$3 $4" + "$5").r(r("([^А-яёЁ]|^)" + month + "-" + month + "([^А-яёЁ]|&)", "gi"), "$1" + "$2—$3" + "$4");
                }

                text = text.r(/(\d)--(\d)/g, '$1–$2').r(/([^-]|\s|^)--([^-]|$|\n)/g, '$1—$2').r(/([^-\d]|^)(\d+)-(\d+)([^-\d]|$)/g, "$1" + "$2−$3" + "$4").r(/([^a-z][a-z]|[Α-Ωα-ω+=*\/])-(\d)/g, "$1−$2")/*.r(/([A-Za-z\s]|^)-(\d+)([^-\d]|$)/g,"$1"+sym[20]+"$2"+"$3").r(/([^-\d]|^)(\d+)-([A-Za-z])/g,"$1"+"$2"+sym[20]+"$3")*/;
            };

            // Замена прочих символов
            if (config.chars) {
                // Не заменяю ... на … из практических соображений: ?.. !.. ?!.
                text = text.r(/([^\.])\.{2,4}/g, "$1...").r(/(\?!|!\?)\.{3}/g, "?!.").r(/\?\.{3}/g, "?..").r(/!\.{3}/g, "!..").r(/(!+)(\?+)/g, "$2" + "$1").r(/(\d+?)[xх](\d+?)/g, "$1×$2").r(/(\d+?)([  ])[xх]([  ])(\d+?)/g, "$1×$4").r(/([0-9a-zA-ZΑ-Ωα-ωА-яёЁ])\^([0-9]+)/g, function ($0, $1, $2) {
                    var l = "0123456789", g = "⁰¹²³⁴⁵⁶⁷⁸⁹";
                    var re = $2;
                    for (var j = 0; j < 10; ++j) {
                        re = re.r(r(l.charAt(j), "g"), g.charAt(j));
                    }
                    return $1 + re
                }).r(/!=/g, "≠").r(/\+\/[\-−]/g, "±").r(/~=/g, "≈").r(/<=/g, "≤").r(/>=/g, "≥").r(/<->/g, "↔").r(/<-([^-]|&)/g, "←$1").r(/([^-]|^)->/g, "$1→").r(/(!+)(\?+)/g, "$2" + "$1").r(/\?{3,}/g, "???").r(/!{3,}/g, "!!!");

                // Дроби
                var t1 = "([^0-9A-Za-zА-яёЁ\/]|^)", t2 = "([^0-9A-Za-zА-яёЁ\/]|$)";
                text = text.r(r(t1 + "1\/2" + t2, "g"), "$1½$2").r(r(t1 + "1\/4" + t2, "g"), "$1¼$2").r(r(t1 + "2\/4" + t2, "g"), "$1½$2").r(r(t1 + "3\/4" + t2, "g"), "$1¾$2").r(r(t1 + "1\/3" + t2, "g"), "$1⅓$2").r(r(t1 + "2\/3" + t2, "g"), "$1⅔$2").r(r(t1 + "1\/5" + t2, "g"), "$1⅕$2").r(r(t1 + "2\/5" + t2, "g"), "$1⅖$2").r(r(t1 + "3\/5" + t2, "g"), "$1⅗$2").r(r(t1 + "4\/5" + t2, "g"), "$1⅘$2").r(r(t1 + "1\/6" + t2, "g"), "$1⅙$2").r(r(t1 + "2\/6" + t2, "g"), "$1⅓$2").r(r(t1 + "3\/6" + t2, "g"), "$1½$2").r(r(t1 + "4\/6" + t2, "g"), "$1⅔$2").r(r(t1 + "5\/6" + t2, "g"), "$1⅚$2").r(r(t1 + "1\/8" + t2, "g"), "$1⅛$2").r(r(t1 + "2\/8" + t2, "g"), "$1¼$2").r(r(t1 + "3\/8" + t2, "g"), "$1⅜$2").r(r(t1 + "4\/8" + t2, "g"), "$1½$2").r(r(t1 + "5\/8" + t2, "g"), "$1⅝$2").r(r(t1 + "6\/8" + t2, "g"), "$1¾$2").r(r(t1 + "7\/8" + t2, "g"), "$1⅞$2").r(/,+/g, ",").r(/:+/g, ":").r(/;+/g, ";").r(/([a-zA-ZА-яёЁ0-9]) (а|но)([\s$,]|\.\.\.)/g, "$1, $2" + "$3").r(/([a-zA-ZА-яёЁ0-9]) однако([\s$,\.!?:])/g, "$1, однако" + "$2");
                text = text.r(/([^a-zА-яёЁ]|^)([a-zА-яёЁ]+)[  ](\2)([^a-zA-ZА-яёЁ]|$)/gi, "$1" + "$2" + "$4")
            };

            // Расстановка кучерявых кавычек
            if (config.quotes) {
                // Предварительная расстановка «ёлочек»
                text = text.r(/(^|\n|\s|—|-|\()"/g, "$1«").r(/"($|\n|\s|—|-|\.|,|!|\?|:|;|\))/g, "»$1").r(/«\)/g, "»)").r(/«( ?)/g, "«").r(/( ?)»/g, "»").r(/>"/g, ">«").r(/"</g, "»<").r(/«""/g, "«««").r(/«"/g, "««").r(/""»/g, "»»»").r(/"»/g, "»»").r(/("{2}|"»)/g, "»»").r(/$"/g, "«").r(/([A-Za-zа-яА-ЯёЁ])'/g, "$1’");
                text = text.r(/[a-zA-ZА-яёЁ]"-/g, "$1»-").r(/-"[a-zA-ZА-яёЁ]/g, "-«$1");

                //Добиваем оставшиеся кавычки как можем
                text = text.r(/(^[^«»]*)"/g, "$1«").r(/"([^«»]*$)/g, "»$1").r(/«([^«»]*)"/g, "«$1»").r(/"([^«»]*)»/g, "«$1»");

                // Замена вложенных «ёлочек» и „лапок“ на „лапки“ и ‚коготки‘
                if (config.lang == "rus" && config.quotesLevel > 1) {
                    function rl(i, j) {
                        var b = "", c, d = "";
                        if (i != 0) {
                            b = text.substring(0, i);
                        }
                        if (j != text.length - 1) {
                            d = text.substring(j + 1, text.length);
                        }
                        c = text.substring(i, j + 1);
                        for (var i = 0; i < 32; ++i) {
                            c = c.r(/«([^«»]*)«([^»]*)»/g, "«$1„$2“");
                            if (config.quotesLevel > 2) {
                                c = c.r(/„([^„“]*)„([^“]*)“/g, "„$1‚$2‘");
                            }
                        }
                        return b + c + d;
                    };
                    var level = 0;
                    for (var i = 0; i < text.length; ++i) {
                        if (text.charAt(i) == '«') {
                            ++level;
                            for (var j = i + 1; j < text.length; ++j) {
                                if (text.charAt(j) == '«') {
                                    ++level;
                                }
                                if (text.charAt(j) == '»') {
                                    --level;
                                    if (level <= 0) {
                                        text = rl(i, j);
                                        i = j;
                                        break;
                                    }
                                }
                            }
                            level = 0;
                        }
                    }
                }
                else {
                    text = text.r(/'([A-Za-zа-яА-ЯёЁ])/g, "‘$1");
                }
            }

            // Преобразование в формат HTML
            if (isHtml) {
                // Замена <> на &lt; &gt;
                if (config.chars) {
                    text = text.r(/<(?!\/?[A-Za-z][^\n$<>]*>|!--)/g, "&lt;").r(/(<\/?[A-Za-z][^\n$<>]*|--)?>/g, function ($0, $1) { return $1 ? $0 : "&gt;" });
                }

                // Параграфы 
                if (config.tabs) {
                    text = text.r(/(\n)(?!<p>)([^\n]*)(?!<\/p>)(\n)/g, "$1<p>$2</p>$3").r(/(\n)(?!<p>)([^\n]*)(?!<\/p>)(\n)/g, "$1<p>$2</p>$3").r(/ +<\/p>(\n)/g, "</p>$1");
                    if (typobegin) {
                        text = text.r(/(^)(?!<p>)([^\n]*)(?!<\/p>)(\n)/g, "$1<p>$2</p>$3");
                        if (typoend) {
                            text = text.r(/(^)(?!<p>)([^\n]*)(?!<\/p>)($)/g, "$1<p>$2</p>$3");
                        }
                    }
                    if (typoend) {
                        text = text.r(/(\n)(?!<p>)([^\n]*)(?!<\/p>)($)/g, "$1<p>$2</p>$3").r(/ +<\/p>(\n|$)/g, "</p>$1");
                    }
                    text = text.r(/<p>(UNTYPO[\d]+)<\/p>/g, "$1");
                    text = text.r(/<p><\/p>/g, "").r(/<p>(UNTYPO[\d]+S)<\/p>/g, "$1");
                    text = text.r(/<p>(.*?<\/?)([uo]l|li|h\d)(>.*?)<\/p>/g, "$1$2$3");
                }

                // Заголовки
                if (config.h1) {
                    var po = config.tabs ? "<p>" : "";
                    var pc = config.tabs ? "</p>" : "";
                    text = text.r(r("(\n|^)" + po + "([А-яёЁa-zA-Z0-9\"«“][^\n]{1,50}[А-яёЁa-zA-Z0-9\"»”\)])" + pc + "(\n|$)", "g"), "$1<h1>$2</h1>$3").r(/<h1>([^а-яА-ЯёЁa-zA-Z§]+?)<\/h1>/g, po + "$1" + pc).r(r("(\n|^)" + po + "(Глава|Chapter|Section|§)([  ]?[IVXLСDМ0-9][^\n]{0,43})" + pc + "(\n|$)", "g"), "$1<h1>$2$3</h1>$4").r(r("(\n|^)" + po + "(Эпилог|Пролог|Epilogue|Prologue)(\.?)" + pc + "(\n|$)", "g"), "$1<h1>$2$3</h1>$4").r(/<h1>(UNTYPO[\d]+S)<\/h1>/g, "$1");
                }

                if (config.nbsp) {
                    text = text.r(/([А-яёЁa-zA-Z0-9]+)((?:-[А-яёЁa-zA-Z0-9]+)+)/g, "<nbsp>$1$2</nbsp>");
                }
            }

            // Английские кавычки
            if (config.lang == "eng") {
                text = text.r(/«/g, "“").r(/»/g, "”");
            };

            // Удаление неразрывных пробелов
            if (!config.nbsp) {
                text = text.r(/ /g, " ");
            }

            // Замена переносов на <br />
            if (config.br) {
                text = text.r(/\n/g, "<br />");
            }

            text = text.r(/ (\))/g, "$1");

            // Преобразование обычных символов в коды
            if (isHtml) {
                for (var i = 0; i < normsym.length; ++i) {
                    text = text.r(r(normsym[i], "g"), "&" + htmlsym[i] + ";");
                }
            }

            if (config.nbsptabs) {
                text = text.r(/ /g, "&nbsp;");
            }

            text = this.unprotect(config, text);
            return text;
		}
    };

    function addEvent(element, event, delegate) {
        if (element.addEventListener) {
            element.addEventListener(event, delegate, false);
        }else{
            aelementattachEvent("on" + event, delegate);
        }
    };

    function removeEvent(element, event, delegate) {
        if (element.removeEventListener) {
            element.removeEventListener(b, c, false);
        } else {
            element.detachEvent("on" + event, delegate);
        }
    };

    window.JsTypograph = function (config) {
		// Конфиг для обработки. Рекомендуется присваивать значение this.config через this.setConfig
        this.config = jstypo.fixConfig(config);
		
		// Привязанные формы ввода
        this.textAreas = [];
		
		// Использовать вместо config = {...}.
        this.setConfig = function(newConfig) {
            this.config = Object.assign(this.config, newConfig);
        };
		
		// Обрабатывает переданный текст и возвращает типографированный вариант
        this.typographyText = function (text, typobegin = true, typoend = true) {
            return jstypo.typographyText(this.config, text, typobegin, typoend);
        };
		
		// Обрабатывает выделенный текст в поле ввода
        this.typographySelection = function (textarea) {
            return jstypo.typographySelection(this.config,textArea);
        }
		
		// Обрабатывает выделенный текст в привязанных формах ввода
        this.typography = function() {
            for (var i = 0; i < this.textAreas.length; ++i) {
                this.typographySelection(this.textAreas[i]);
            }
        };
		
		// Привязывает форму ввода к типографу
        this.addTextArea = function(textarea) {
            this.textAreas.push(textarea);
        };
		
		// Отвязывает форму ввода от типографа
        this.removeTextArea = function (textarea) {
            var index = textAreas.indexOf(textarea);
            if (index > -1) {
                textAreas.splice(index, 1);
            }
        };
		
		// Привязывает метод typography к объекту (для корректной работы в обработчиках событий)
        this.typography = this.typography.bind(this);
		
		// Привязывает кнопку для запуска типографа. Накладывает this.typography на onclick
        this.addButton = function(button) {
            addEvent(button, 'click', this.typography);
        };
		
		// Отвязывает кнопку для запуска от типографа. Убирает this.typography на onclick
        this.removeButton = function (button) {
            removeEvent(button, 'click', this.typography);
        };
    };

    window.JsTypographCore = jstypo;
})();