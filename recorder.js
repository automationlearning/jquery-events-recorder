/**
 * This script records all jQuery events on the page and returns the code to you
 *
 * @author: Sérgio Vilar <vilar@me.com>
 * @url: http://sergiovilar.com.br
 */

var Recorder = function(){

    this.dom = $('body');
    this.events = ['click', 'change'];
    this.recording = false;
    this.frames = [];

}

Recorder.prototype.start = function(){

    var self = this;
    self.recording = true;

    $.each(self.events, function(i, item){

        $(self.dom).bind(item, function(event){

            if(self.recording){
                var frame = self.packFrame(event);
                console.log(frame);
                self.frames.push(frame);
            }

        });

    });

};

Recorder.prototype.getScript = function(){

    var self = this;
    var script = '';

    for(var i in self.frames){

        var item = self.frames[i];
        var selector = '';
        var linecode = '';
        var arr = item.target.split('/');

        for(var z in arr){

            if(z == 0){
                selector += '$("'+arr[z]+'")';
            }else{
                selector += '.find("'+arr[z]+'")';
            }

        }

        if(item.value !== null){
            linecode = selector + '.val("'+item.value+'");';
        }else{
            linecode = selector + '.trigger("'+item.type+'");';
        }

        script += linecode + '\n';

    }

    script = script.replace(/"/g, "'");

    console.log(script);

}


Recorder.prototype.packFrame = function(e){

    var self = this;

    return {
        x: e.pageX,
        y: e.pageY,
        type: e.type,
        target: self.getSelector(e.target),
        value: e.type == 'change' ? $(e.target).val() : null
    };

};

Recorder.prototype.getSelector = function(elm) {

    function replaceIndex(item){

        if(typeof item === 'undefined')
            return false;

        var index = item.split('eq(')[1].split(')')[0];
        var replaced = 'eq(' + (parseInt(index) + 1);
        return item.replace('eq('+index, replaced);

    }

    for (segs = []; elm && elm.nodeType == 1; elm = elm.parentNode) {

        var tag = $(elm).prop('tagName');

        if(tag !== 'BODY' && tag !== 'HTML'){

            if (elm.hasAttribute('id')) {

                segs.unshift('#' + elm.getAttribute('id'));
                return segs.join('/');

            } else if (elm.hasAttribute('class')){

                segs.unshift(elm.localName.toLowerCase() + '.' + elm.getAttribute('class'));

            } else {

                for (i = 1, sib = elm.previousSibling; sib; sib = sib.previousSibling){
                    if (sib.localName == elm.localName){
                        i++;
                    }
                    segs.unshift(elm.localName.toLowerCase() + ':eq(' + (i-1) + ')');

                }

           }
       }else{
           break;
       }

   }

   for(var i in segs){

       var item = segs[i];

       if(item.indexOf('eq(') > -1 && (segs[parseInt(i, 10) + 1] !== item && typeof segs[parseInt(i, 10) + 1] !== 'undefined')){
           segs.splice(parseInt(i, 10), 1);
       }else if(item === segs[parseInt(i, 10) + 1]){
           segs.splice((parseInt(i, 10) + 1), 1);
       }

       if(segs[parseInt(i, 10) + -1] === item){
           segs.splice(parseInt(i, 10), 1);
       }

       if(item === replaceIndex(segs[parseInt(i, 10) + 1])){
           var counter = 0;
           for(var z in segs){
               if(z >= i){
                   if(segs[z] === replaceIndex(segs[parseInt(z, 10) + 1])){
                       counter++;
                   }
               }
           }
           segs.splice((parseInt(i, 10) + 1), counter + 1);

       }

   }

   for(var i in segs){

       if(segs[i] === segs[parseInt(i, 10) + 1]){
           segs.splice(parseInt(i, 10) + 1, 1);
       }
   }

   if(segs.length === 0){
       return 'body';
   }else{
        return segs.join('/');
   }

};

if(typeof define === "function"){
    define([], function(){
        return Recorder;
    })
}else{
    window.Recorder = Recorder;
}
