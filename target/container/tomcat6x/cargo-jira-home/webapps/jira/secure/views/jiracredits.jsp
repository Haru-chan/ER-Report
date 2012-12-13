<%@ taglib prefix="ww" uri="webwork" %>
<%@ taglib prefix="aui" uri="webwork" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>

<html>
<head>
    <title><ww:text name="'about.jira.name'"/></title>
    <meta name="decorator" content="panel-general" />
</head>
<body>
    <style type="text/css">

#stage {
        color:#fff;font-family:Helvetica,Arial,Verdana,sans-serif;height:630px;margin:0 auto 0;overflow:hidden;position:relative;text-align:center;width:1000px;
        background: rgb(19,40,73);
        background: -moz-linear-gradient(90deg, rgba(19,40,73,1) 0%,rgba(40,49,53,1) 100%);
        background: -webkit-linear-gradient(90deg, rgba(19,40,73,1) 0%,rgba(40,49,53,1) 100%);
        background: -o-linear-gradient(90deg, rgba(19,40,73,1) 0%,rgba(40,49,53,1) 100%);
        background: -ms-linear-gradient(90deg, rgba(19,40,73,1) 0%,rgba(40,49,53,1) 100%);
        background: linear-gradient(90deg, rgba(19,40,73,1) 0%,rgba(40,49,53,1) 100%);
        }
.cloud {background-color:#ddd;width:20em;height:10em;border-radius:5em;position:absolute;left:-20em;opacity:0.65;}
.cloud > div {background-color:#ddd;width:10em;height:10em;position:absolute;top:-50px;left:25%;border-radius:5em;}

.fluffy {
        background: rgb(238,238,238);
        background: -moz-linear-gradient(10deg, rgba(238,238,238,1) 0%, rgba(204,204,204,1) 100%);
        background: -webkit-linear-gradient(10deg, rgba(238,238,238,1) 0%,rgba(204,204,204,1) 100%);
        background: -o-linear-gradient(10deg, rgba(238,238,238,1) 0%,rgba(204,204,204,1) 100%);
        background: -ms-linear-gradient(10deg, rgba(238,238,238,1) 0%,rgba(204,204,204,1) 100%);
        background: linear-gradient(10deg, rgba(238,238,238,1) 0%,rgba(204,204,204,1) 100%);
        }
#stage .fluffy h1,
#stage .fluffy h2 {color:#fff;margin: 0;}

    #one {font-size:12px;
        -webkit-animation: one 20s infinite linear;
        -moz-animation: one 20s infinite linear;
        }
        @-webkit-keyframes one {
        from { -webkit-transform: translate(0, 5em); }
        to { -webkit-transform: translate(1200px, 5em); }
        }
        @-moz-keyframes one {
        from { -moz-transform:translate(0, 5em); }
        to { -moz-transform: translate(1200px, 5em); }
        }

    #two {font-size:16px;
        -webkit-animation: two 30s infinite linear;
        -moz-animation: two 30s infinite linear;
        }
        @-webkit-keyframes two {
        from { -webkit-transform: translate(0, 10em); }
        to { -webkit-transform: translate(1200px, 10em); }
        }
        @-moz-keyframes two {
        from { -moz-transform: translate(0, 10em); }
        to { -moz-transform: translate(1200px, 10em); }
        }

    #three {font-size:10px;
        -webkit-animation: two 60s infinite linear;
        -moz-animation: two 60s infinite linear;
        }
        @-webkit-keyframes three {
        from { -webkit-transform: translate(300px, 10em); }
        to { -webkit-transform: translate(1200px, 10em); }
        }
        @-moz-keyframes three {
        from { -moz-transform: translate(300px, 10em); }
        to { -moz-transform: translate(1200px, 10em); }
        }

#spot {color:#333;position:absolute;top:50px;right:300px;border-radius:100px;background-color:#ffc;width:200px;height:200px;display:table;opacity:0.8;
        -webkit-transform: skew(20deg, 0);
        -moz-transform: skew(20deg, 0);
        -o-transform: skew(20deg, 0);
        -ms-transform: skew(20deg, 0);
        transform: skew(20deg, 0);
}

#spot .charlie {background: url("<%= request.getContextPath() %>/images/credits50_charlie.png") no-repeat 50% 50%;width:200px;height:200px;}
#spot-drop {position:absolute;border:118px solid transparent;top:271px;right:305px;height:0;width:0;opacity:0.1;border-right-color:#ffc;border-right-width:550px;
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        -o-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        transform: rotate(-45deg);
}

#crew {font-size:24px;font-weight:bold;display:table-cell;text-align:center;vertical-align:middle;width:200px;height:200px; }
#crew .role {display:block;}

ul.crew {color:#666;background:transparent url("<%= request.getContextPath() %>/images/credits50_sydney.png") no-repeat 0 0;display:block;position:absolute;left:0;bottom:0;height:80px;width:100%;margin:0;padding:120px 0 0;list-style:none;font-size:12px;}
ul.crew li {display:inline;margin:0 .5em;}
ul.crew .role {display:none;}

.msie-8 #stage {background-color: #D3D5AF;}
.msie-8 #spot {left:40%;right:auto;background-color: #D3D5AF;top:150px;}
.msie-8 #spot-drop,
.msie-8 .cloud  {display:none;}
.msie-gt-8 #one,
.opera #one {left:100px;top:100px;}
.msie-gt-8 #two,
.opera #two {left:300px;top:200px;}
.msie-gt-8 #three,
.opera #three {left:700px;top:150px;}


    </style>
    <script>

    jQuery(function(){
        var crew = jQuery("#crew");

        jQuery("#credits").mouseover(function(e){

            var target = jQuery(e.target);
            if (target.is("li")) {
                // remove spotlight logo
                crew.html(target.html());
                crew.removeClass("charlie")
            } else {
                // replace the spotlight logo
                crew.empty();
                crew.addClass("charlie")
            }
        });


    });

    </script>


    <div id="stage">
        <div class="cloud fluffy" id="one">
            <div class="fluffy"><h1>JIRA</h1></div>
        </div>
        <div class="cloud fluffy" id="two">
            <div class="fluffy"><h2>5.0</h2></div>
        </div>
        <div class="cloud fluffy" id="three">
            <div class="fluffy"></div>
        </div>




        <div id="spot">
            <div id="crew" class="charlie"></div>
        </div>
        <div id="spot-drop"></div>

        <div id="credits">
            <ul class="crew">
                <li>Brenden Bain<span class="role">Developer</span></li>
                <li>Brad Baker<span class="role">Developer</span></li>
                <li>Stuart Bargon<span class="role">Scrum Master</span></li>
                <li>Veenu Bharara<span class="role">QA Engineer</span></li>
                <li>Trevor Campbell<span class="role">Developer</span></li>
                <li>Ross Chaldecott<span class="role">Designer</span></li>
                <li>Panna Cherukuri<span class="role">QA Engineer</span></li>
                <li>Jonathon Creenaune<span class="role">Developer</span></li>
                <li>Sean Curtis<span class="role">Frontend Developer</span></li>
                <li>Dave Elkan<span class="role">Javascript Developer</span></li>
                <li>Giles Gaskell<span class="role">Technical Writer</span></li>
                <li>Shihab Hamid<span class="role">Development Team Lead</span></li>
                <li>Scott Harwood<span class="role">Javascript Developer</span></li>
                <li>James Hatherly<span class="role">Graduate Developer</span></li>
                <li>Adrian Hempel<span class="role">Developer</span></li>
                <li>Alex Hennecke<span class="role">Developer</span></li>
                <li>Oswaldo	Hernandez<span class="role">Developer</span></li>
                <li>Scott Hughes<span class="role">JavaScript Developer</span></li>
                <li>Rosie Jameson<span class="role">Technical Writer</span></li>
                <li>Bryce Johnson<span class="role">Build Engineer</span></li>
                <li>Martin Jopson<span class="role">Frontend Developer</span></li>
                <li>Andreas	Knecht<span class="role">Development Team Lead</span></li>
                <li>Dariusz	Kordonski<span class="role">Developer</span></li>
                <li>Roy Krishna<span class="role">Product Manager</span></li>
                <li>Peggy Kuo<span class="role">Developer</span></li>
                <li>Mark Lassau<span class="role">Development Team Lead</span></li>
                <li>Nick Menere<span class="role">Product Engineer</span></li>
                <li>Luis Miranda<span class="role">Developer</span></li>
                <li>Chris Mountford<span class="role">Developer</span></li>
                <li>Olli Nevalainen<span class="role">Developer</span></li>
                <li>Ken Olofsen<span class="role">Marketing Manager</span></li>
                <li>Justus Pendleton<span class="role">Development Team Lead</span></li>
                <li>Matt Quail<span class="role">Product Architect</span></li>
                <li>Jay Rogers<span class="role">UI Designer</span></li>
                <li>Bryan Rollins<span class="role">Product Manager</span></li>
                <li>Michael	Ruflin<span class="role">Developer</span></li>
                <li>Felix Schmitz<span class="role">Developer</span></li>
                <li>Mike Sharp<span class="role">Design Engineer</span></li>
                <li>Paul Slade<span class="role">Manager JIRA</span></li>
                <li>Robert Smart<span class="role">Developer</span></li>
                <li>Graeme Smith<span class="role">Developer</span></li>
                <li>Min'an Tan<span class="role">Developer</span></li>
                <li>Michael	Tokar<span class="role">Developer</span></li>
                <li>James Winters<span class="role">Development Team Lead</span></li>
                <li>Edwin Wong<span class="role">Product Manager</span></li>
                <li>James Wong<span class="role">Developer</span></li>
                <li>Penny Wyatt<span class="role">QA Engineer</span></li>
                <li>Edward Zhang<span class="role">Graduate Developer</span></li>
            </ul>
        </div>
    </div>
</body>
</html>
