function showPromoWindow(){var a=document.body.offsetWidth,b=document.body.offsetHeight,c=document.getElementById(promo_id),d=document.getElementById(overlay_id),e=document.getElementById(blur_id),f=a+"x"+b,g="?utm_source=ad_overlay&utm_medium="+f+"&utm_term=__LINK__&utm_campaign=overlay";if(c.style.display="none",e.className="",null!==d)d.style.display="block";else{d=document.createElement("div");var h=document.getElementById(root_id),i=document.createElement("div"),j=document.createElement("a"),k=document.createElement("img"),l=document.createElement("div"),m=document.createElement("div"),n=document.createElement("a"),o=document.createElement("a"),p=document.createTextNode("\u2715");d.id=overlay_id,d.className=80<Math.ceil(100*b/a)?"vertical":"horizontal",i.id="atm_overlay_exit",j.id="atm_logo_link",k.id="atm_logo_img",l.id="atm_promo_text",l.className=300<Math.ceil(100*b/a)?"vertical_sticky":"",m.id="atm_promo_links",i.addEventListener?i.addEventListener("click",closeOverlay):i.attachEvent("onclick",closeOverlay),i.appendChild(p),j.setAttribute("href","http://adtarget.me"+g.replace("__LINK__","logo")),j.setAttribute("target","_blank"),k.setAttribute("src","//static-ads.adtarget.me/images/logo.png"),k.setAttribute("alt","adtarget.me"),j.appendChild(k);var q=document.createTextNode("Adtarget.me is a platform providing intelligent online display advertising services. Our technology uses cookies to make the online advertisements you see more relevant to you. We do not collect or store your personal information. Please access the links below for more information.");b>=90?l.appendChild(q):l.className="no_text";var r=document.createTextNode("More about our services\xa0\xbb");n.appendChild(r);var s=document.createTextNode("Privacy Policy & Opt out options\xa0\xbb");o.appendChild(s),n.setAttribute("href","http://adtarget.me"+g.replace("__LINK__","link1")),n.setAttribute("target","_blank"),o.setAttribute("href","http://adtarget.me/privacy.html"+g.replace("__LINK__","link2")),o.setAttribute("target","_blank"),m.appendChild(n),m.appendChild(o),l.appendChild(m),d.appendChild(i),d.appendChild(j),d.appendChild(l),h.appendChild(d);var t=document.getElementById("atm_logo_img"),u=document.getElementById("atm_promo_text"),v=document.getElementById("atm_logo_link").offsetHeight;t.attachEvent?t.setAttribute("onload",verticallyCenteringLogo(t,v)):t.onload=function(){var a=t.offsetHeight,b=Math.ceil((v-a)/2);t.style.marginTop=b+"px"};var w=b-v||b;u.style.height=w+"px",textFill(w,u)}}function verticallyCenteringLogo(a,b){var c=a.offsetHeight,d=Math.ceil((b-c)/2);a.style.marginTop=d+"px"}function closeOverlay(){var a=document.getElementById(promo_id),b=document.getElementById(overlay_id),c=document.getElementById(blur_id);a.style.display="block",b.style.display="none",c.className="hidden"}function wrapInner(a,b){var c=a.childNodes.length;a.insertBefore(b,a.firstChild);for(var d=c;d>0;--d)b.insertBefore(a.removeChild(a.childNodes[d]),b.firstChild)}function textFill(a,b,c){c=c||{};var d=c.max_font_size||12,e=a,f=0;do b.style.fontSize=d+"px",b.style.lineHeight=d+3+"px",f=b.offsetHeight,--d;while(f>e&&d>3)}var promo_id="atm_promo",root_id="atm_overlay_root",overlay_id="atm_overlay",blur_id="atm_blur";window.onload=function(){var a=document.createElement("div"),b=document.createElement("div");b.id=blur_id,b.className="hidden",a.id=root_id,wrapInner(document.body,a),wrapInner(document.getElementById(root_id),b);var c=document.getElementById(promo_id);c.addEventListener?c.addEventListener("click",showPromoWindow):c.attachEvent("onclick",showPromoWindow)};