var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
var canvas1=document.getElementById("canvas1");
var ctx1=canvas1.getContext("2d");

// anchors defining the warped rectangle
var anchors= getSquarePoints(face1); 

// cornerpoints defining the desire unwarped rectangle
var unwarped={
  TL:{x:0,y:0},        // r
  TR:{x:300,y:0},      // g
  BR:{x:300,y:300},    // b
  BL:{x:0,y:300},      // gold
}

// load example image
var img=new Image();
img.onload=start;
img.src="img.jpg";

function getSquarePoints(points) {
	var leftToRight = points.sort((a, b) => a.x > b.x);
	var lefts = leftToRight.slice(0, 2);
	var right = leftToRight.slice(2, 4);

	var leftTopToBottom = lefts.sort((a, b) => a.y > b.y);
	var rightTopToBottom = right.sort((a, b) => a.y > b.y);

	return {
		TL: leftTopToBottom[0],
		TR: rightTopToBottom[0],
		BL: leftTopToBottom[1],
		BR: rightTopToBottom[1]
	}
}

function drawPoint(x, y, ctx){
  ctx.beginPath();
	ctx.arc(x, y, 10, 0, 2 * Math.PI, true);
	ctx.fillStyle="red";
	ctx.fill();
  ctx.stroke();
}

function start(){

  // set canvas sizes equal to image size
  cw=canvas.width=canvas1.width=img.width;
  ch=canvas.height=canvas1.height=img.height;

  // draw the example image on the source canvas
  ctx.drawImage(img,0,0);

  // unwarp the source rectangle and draw it to the destination canvas
	unwarp(anchors,unwarped,ctx1);
	
	var points = Object.values(anchors);

	for (let i = 0; i < points.length; i++) {
		const point = points[i];
		drawPoint(point.x, point.y, ctx);
	}

}


// unwarp the source rectangle
function unwarp(anchors,unwarped,context){

  // clear the destination canvas
  context.clearRect(0,0,context.canvas.width,context.canvas.height);

  // unwarp the bottom-left triangle of the warped polygon
  mapTriangle(context,
              anchors.TL,  anchors.BR,  anchors.BL,
              unwarped.TL, unwarped.BR, unwarped.BL
             );

  // eliminate slight space between triangles
  ctx1.translate(-1,1);

  // unwarp the top-right triangle of the warped polygon
  mapTriangle(context,
              anchors.TL,  anchors.TR,  anchors.BR,
              unwarped.TL, unwarped.TR, unwarped.BR
             );

}


// Perspective mapping: Map warped triangle into unwarped triangle
// Attribution: (SO user: 6502), http://stackoverflow.com/questions/4774172/image-manipulation-and-texture-mapping-using-html5-canvas/4774298#4774298
function mapTriangle(ctx,p0, p1, p2, p_0, p_1, p_2) {

  // break out the individual triangles x's & y's
  var x0=p_0.x, y0=p_0.y;
  var x1=p_1.x, y1=p_1.y;
  var x2=p_2.x, y2=p_2.y;
  var u0=p0.x,  v0=p0.y;
  var u1=p1.x,  v1=p1.y;
  var u2=p2.x,  v2=p2.y;

  // save the unclipped & untransformed destination canvas
  ctx.save();

  // clip the destination canvas to the unwarped destination triangle
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.closePath();
  ctx.clip();

  // Compute matrix transform
  var delta   = u0 * v1 + v0 * u2 + u1 * v2 - v1 * u2 - v0 * u1 - u0 * v2;
  var delta_a = x0 * v1 + v0 * x2 + x1 * v2 - v1 * x2 - v0 * x1 - x0 * v2;
  var delta_b = u0 * x1 + x0 * u2 + u1 * x2 - x1 * u2 - x0 * u1 - u0 * x2;
  var delta_c = u0 * v1 * x2 + v0 * x1 * u2 + x0 * u1 * v2 - x0 * v1 * u2 - v0 * u1 * x2 - u0 * x1 * v2;
  var delta_d = y0 * v1 + v0 * y2 + y1 * v2 - v1 * y2 - v0 * y1 - y0 * v2;
  var delta_e = u0 * y1 + y0 * u2 + u1 * y2 - y1 * u2 - y0 * u1 - u0 * y2;
  var delta_f = u0 * v1 * y2 + v0 * y1 * u2 + y0 * u1 * v2 - y0 * v1 * u2 - v0 * u1 * y2 - u0 * y1 * v2;

  // Draw the transformed image
  ctx.transform(
    delta_a / delta, delta_d / delta,
    delta_b / delta, delta_e / delta,
    delta_c / delta, delta_f / delta
  );

  // draw the transformed source image to the destination canvas
  ctx.drawImage(img,0,0);

  // restore the context to it's unclipped untransformed state
  ctx.restore();
}