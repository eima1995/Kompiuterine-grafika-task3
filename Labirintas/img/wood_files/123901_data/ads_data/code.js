var slideDelay = 4.9;
var imgWidth = 84;
var imgHeight = 84;
var currentSlide = 0;
var slideTimer = false;
var slideTimeout = 30;
var titleLength = 60;

var cutAndAddElipss = function (params) {
    var text = '';
    if ('undefined' !== typeof params && 'object' === typeof params) {
        if(params.title && null !== params.title && 'undefined' !== typeof params.title && '' !== params.title) {
            text = params.title;
        }
    }
    var max_chars = 60;
    if ('undefined' !== typeof params && 'object' === typeof params) {
        if ( null !== params.max_chars && 'undefined' !== typeof params.max_chars
            && '' !== params.max_chars && 'number' === typeof params.max_chars) {
            max_chars = parseInt(params.max_chars);
        }
    }
    if ('' !== text) {
        var elText  = $.trim(text);
        var elLength = elText.length;
        var afterElipss = '&hellip;';
        if (elLength > max_chars) {
            var textSlice = $.trim(elText.substr(0,max_chars)),
                textSliced = $.trim(elText.substr(max_chars));
            if (textSlice.length < max_chars) {
                var textVisible = textSlice,textHidden = $.trim(elText.substr(max_chars));
            } else {
                var arrSlice = textSlice.split(' '),popped = arrSlice.pop(),
                    textVisible = arrSlice.join(' ') + ' ',textHidden = popped + textSliced + ' ';
            };
            text = textVisible + '' + afterElipss;
        } else {
            text = elText;
        }
    }
    return text;
};

function number_format (number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');

    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };

    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');

    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }

    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }

    return s.join(dec);
}

function unescapeText(input) {
    var output = unescape(input.trim().replace(/\\u/g, '%u'));
    return output;
}

function formatCurrency(num) {
    num = num.toString();
    return number_format(num.replace(",", "."), 2, '.', ' ') + unescapeText(' <span> \u20AC</span>');
}

function resizeImgUrl(url) {
    if (url.lastIndexOf('.') !== -1) {
        return url.substr(0, url.lastIndexOf('.')) + '_' + imgWidth + 'x' + imgHeight + url.substr(url.lastIndexOf('.'), url.length);
    } else {
        return url;
    }
}

function getDiscount(old, current) {
    return Math.round(100-(current/old*100));
}

function parseDataToHtml(data, test) {
    var preview = true;
    if ('${__DATA__}' !== data) {
        data = $.parseJSON(data);
        preview = false;
    } else if ('__TEST__' !== test) {
        data = $.parseJSON(test);
    }

    var $tpl = $('#product_template');
    $('#logo').attr('href', data.fallback_url).attr('target', '_blank');

    if (data.items.length > 0) {
        var i = 0;

        for (i in data.items) {
            var $product = $('<div/>').addClass('product').html($tpl.html());
            var item = data.items[i];

            if (null !== item.image) {

                if (true === preview) {

                    isSupportSVG(function(answer) {
                        if (true === answer) {
                            if ( 'object' === typeof item.image && 'undefined' !== typeof item.image[0] ) {
                                item.image = item.image[0].toString();
                            } else {
                                item.image = item.image.toString();
                            }
                        } else {
                            if ( 'object' === typeof item.image && 'undefined' !== typeof item.image[1] ) {
                                item.image = item.image[1].toString();
                            } else {
                                item.image = item.image.toString();
                            }
                        }

                        if ('undefined' !== typeof data.static_url && '//' !== item.image.toString().substr(0, 2)) {
                            item.image = data.static_url + item.image;
                        }

                        $('.image', $product).attr('src', item.image.toString());
                    });
                } else {
                    if ('object' === typeof item.image && 'undefined' !== typeof item.image[0]){
                        item.image = item.image[0].toString();
                    } else {
                        item.image = item.image.toString();
                    }

                    if ('undefined' !== typeof data.static_url && '//' !== item.image.toString().substr(0, 2)) {
                        item.image = data.static_url + item.image;
                    }

                    $('.image', $product).attr('src', resizeImgUrl(item.image));
                }

            }

            if ('undefined' !== typeof item.data.title && '' !== item.data.title) {
                $('.title', $product).html(cutAndAddElipss({'title':item.data.title,'max_chars':titleLength})).text();
            } else {
                $('.title', $product).remove();
            }

            if ('undefined' !== typeof item.data.price && '' !== item.data.price
                && 0.0 < parseFloat(item.data.price)) {
                $('.price', $product).html(formatCurrency(item.data.price));
            } else {
                $('.price', $product).remove();
            }

            if ('undefined' !== typeof item.data.price
                && 'undefined' !== typeof item.data.old_price
                && '' !== item.data.price && 0.0 < parseFloat(item.data.price)
                && '' !== item.data.old_price && 0.0 < parseFloat(item.data.old_price)
                && parseFloat(item.data.old_price) > parseFloat(item.data.price)) {
                $('.old_price', $product).html(formatCurrency(item.data.old_price));
                if (0 < ($('.discount', $product)).length) {
                    $('.discount', $product).html('-' + getDiscount(parseFloat(item.data.old_price), parseFloat(item.data.price)) + '%');
                }
            } else {
                $('.old_price', $product).remove();
                $('.discount', $product).remove();
            }

            $('.buy_button', $product).append($('<div/>').addClass('buy_text').html(unescapeText('PERKU')));

            if ('undefined' !== typeof data.click_path && 'http://' !== item.url.substr(0, 7)) {
                item.url = data.click_path + item.url;
            }

            $('.item_url', $product).attr('href', item.url);
            $('#products').append($product);
            
            $product.find('img').hide();
            verticalAlign($product);
        }
    }
}

function verticalAlign(element) {
    element.find('img').load(function() {
        var height = parseInt($(this).height());
        var width = parseInt($(this).width());

        var parent_height = parseInt($(this).parent().height());
        var parent_width = parseInt($(this).parent().width());

        var ratio = parseFloat(width / height).toFixed(3);
        var step = 10;

        if (0 !== width && 0 !== height && 0 !== parent_height && 0 !== parent_width) {

            var new_width = width;
            var new_height = height;

            step = 0;
            if (ratio >= 1.000) {

                new_width = parent_width - step;
                new_height = Math.ceil(new_width / ratio);
            } else {
                new_height = parent_height - step;
                new_width = Math.ceil(new_height * ratio);
            }
            if (0 !== new_height && 0 !== new_width) {
                $(this).css({'width':new_width+'px','height':new_height+'px'});
            }
            if (0 !== new_height && new_height < parent_height && ratio > 1.000) {
                var margin = Math.ceil(Math.abs(parent_height - new_height) / 2);
                if (margin + new_height < parent_height) {
                    $(this).css('margin-top', margin+'px');
                }
            }
        }

        $(this).show();
    });
}

function verticalAlignContent(element) {
    element.find('img').load(function() {
        var height = parseInt($(this).height());
        var width = parseInt($(this).width());

        var parent_height = parseInt($(this).parent().height());
        var parent_width = parseInt($(this).parent().width());

        var content_height = parseInt($('#product .item_image').height());
        var content_width = parseInt($('#product .item_image').width());

        var ratio = parseFloat(width / height).toFixed(3);
        var step = 14;

        if (0 !== width && 0 !== height && 0 !== parent_width && 0 !== parent_width ) {

            var new_width = width;
            var new_height = height;

            if (ratio > 1.000) {
                step = 0;
                new_width = imgWidth - step;
                new_height = Math.ceil(new_width / ratio);
            } else if (ratio < 1.000)  {
                new_height = imgHeight - step;
                new_width = Math.ceil(new_height * ratio);
            } else {
                if (content_width > new_width) {
                    new_width = content_width - step;
                    new_height = Math.ceil(new_width * ratio);
                }
                if (content_height > new_height) {
                    new_height = content_height - step;
                    new_width = Math.ceil(new_height / ratio);
                }
            }

            if (0 !== new_height && 0 !== new_width) {
                $(this).css({'width':new_width+'px','height':new_height+'px'});
            }
            if (0 !== new_height && new_height < content_height) {
                var margin = Math.ceil(Math.abs(content_height - new_height) / 2);
                if (margin + new_height < content_height) {
                    $(this).css('margin-top', margin+'px');
                }
            }
        }

        $(this).show();
    });
}


function showItem(item) {
    if ('undefined' === typeof item) {
        item = $('.product.active').next();

        if (0 === item.length) {
            item = $('.product').first();
        }
    }

    $('.product').removeClass('active');
    $(item).addClass('active');

    $('#product').animate({
        marginTop: '-88px'
    }, 100, 'swing', function() {
        $('#product').css({marginTop: '88px'});
        $('#product').html($(item).html());
        verticalAlignContent($('#product'));

        $('#product').animate({
            marginTop: '0px'
        }, 100, 'swing', function() {

        });
    });
}

function addEvent(e,d,t){var n=null,i=document.getElementById(""+e),o=document.getElementById("border");return i&&"undefined"!=typeof i&&""!==d&&"undefined"!=typeof t&&(n=o.addEventListener?i.addEventListener(d,t,!1):o.attachEvent?i.attachEvent("on"+d,t):i.setAttribute("onclick",t)),n}function showBadgeInfo(){var e=!0,d=$("#badged_info"),t=$("#badged");!0===e&&"undefined"!=typeof d&&"undefined"!=typeof t&&(d.css({display:"table"}),t.hide())}function hideBadgeInfo(){var e=!0,d=$("#badged_info"),t=$("#badged");!0===e&&"undefined"!=typeof d&&"undefined"!=typeof t&&(d.css({display:"none"}).hide(),t.show())}function showBadge(){var e=!0,d=$("#border");!0===e&&"undefined"!=typeof d&&($("<div/>").attr("id","badged").css({position:"absolute",top:"-1px",left:"-1px","z-index":"5",padding:"2px",margin:"0",width:"70px",height:"15px","line-height":"15px","font-size":"8px",border:"1px solid #fefefe","text-align":"center","vertical-align":"middle",color:"#000","background-color":"#f0f0f0",opacity:.6,"border-radius":"4px","overflow":"hidden"}).html(unescapeText("NUOLAIDA")).appendTo(d),$("<div/>").attr("id","badged_info").css({position:"absolute",top:"-1px",left:"-1px","z-index":"5",padding:"1px",margin:"0",width:"194px",height:"24px","max-height":"75px",border:"1px solid #c0c0c0",color:"#fff","background-color":"#000","text-align":"center",opacity:.6,display:"none","border-radius":"4px"}).appendTo(d),$("<span/>").css({"font-size":"8px","line-height":"8px","vertical-align":"middle",display:"table-cell"}).text(unescapeText("kodas%3A%20minus5proc")).appendTo($("#badged_info")),addEvent("badged","click",showBadgeInfo),addEvent("badged_info","click",hideBadgeInfo),$("#badged").mouseover(function(){$(this).css({cursor:"pointer"})}).mouseout(function(){$(this).css({cursor:"default"})}),$("#badged_info").mouseover(function(){$(this).css({cursor:"pointer"})}).mouseout(function(){$(this).css({cursor:"default"})}))}
$(function () {
    $(window).load(function() {
        $('#product').html($('.product').first().addClass('active').html());
        verticalAlignContent($('#product'));
        showBadge();
        
        var to;
        $(".product").on({
            mouseenter: function() {
                var item = this;
                to = setTimeout(function() {
                    clearInterval(slideTimer);
                    showItem(item);
                }, 200);
            },
            mouseleave: function() {
                clearTimeout(to);
            }
        });

        slideTimer = setInterval(function() {
            showItem();
        }, slideDelay * 1000);

        setTimeout(function() {
            clearInterval(slideTimer);
            var item = $('.product').first();
            if ('undefined' === typeof item) {
                    item = $('.product.active').next();

                if (0 === item.length) {
                    item = $('.product').first();
                }
            }

            $('.product').removeClass('active');
            $(item).addClass('active');
            showItem(item);
        }, slideTimeout * 1000);
    });
});

var isSupportSVG = function (callback) {
    var result = true;
    if (navigator.appName == 'Microsoft Internet Explorer'
        ||  !!(navigator.userAgent.match(/Trident/)
        || navigator.userAgent.match(/rv 11/))
        || ('undefined' !== typeof $ && 'undefined' !== typeof $.browser && $.browser.msie == 1)) {
        result = false;
    }
    callback(result);
};