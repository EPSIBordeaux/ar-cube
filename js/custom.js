var square_bas, square_droite, square_gauche, square_haut1, square_haut2;

var renderer, camera, scene

var textureLoader = new THREE.TextureLoader();

AFRAME.registerComponent('registerevents', {
    init: function () {
        this.marker = this.el;
        var group = document.querySelector('a-box').object3D;

        // MATERIALS 
        var material_color_orange = new THREE.MeshBasicMaterial({ color: 0xF6831E, side: THREE.DoubleSide });
        var material_color_cyan = new THREE.MeshBasicMaterial({ color: 0x435354, side: THREE.DoubleSide });
        var material_color_lightOrange = new THREE.MeshBasicMaterial({ color: 0xffce0c, side: THREE.DoubleSide });
        var material_color_red = new THREE.MeshBasicMaterial({ color: 0xff400c, side: THREE.DoubleSide });
        var material_color_violet = new THREE.MeshBasicMaterial({ color: 0xda0cff, side: THREE.DoubleSide });

        // MESH 
        square_bas = createAndPlaceSquare(material_color_orange, -1, undefined, undefined);
        group.add(square_bas);
        square_haut1 = createAndPlaceSquare(material_color_cyan, -1, undefined, -2);
        group.add(square_haut1);
        square_haut2 = createAndPlaceSquare(material_color_lightOrange, -1, undefined, -3);
        group.add(square_haut2);
        square_gauche = createAndPlaceSquare(material_color_red, -2, undefined, -1);
        group.add(square_gauche);
        square_droite = createAndPlaceSquare(material_color_violet, undefined, undefined, -1);
        group.add(square_droite);

        axis = new THREE.AxisHelper(10);
        axis.position = square_haut2.position;
        square_haut2.add(axis);

        this.marker.addEventListener('markerFound', function () {
            var marker = this.object3D;
            var markerId = marker.id;
            console.log('markerFound', markerId);
            loadTexture(square_bas, "HIRO.jpg");
        });

        this.marker.addEventListener('markerLost', function () {
            var marker = this.object3D;
            var markerId = marker.id;
            console.log('markerLost', markerId);
        });
    }
});

AFRAME.registerComponent('setupscene', {
    init: function () {
        scene = this.el.object3D;
        renderer = this.el.renderer;
        camera = this.el.camera;
    }
});

animate();

function drawSquare(x1, y1, x2, y2) {
    // https://codepen.io/HelloPopartz/pen/EZOPEq
    var square = new THREE.Geometry();
    square.vertices.push(new THREE.Vector3(x1, y1, 0));
    square.vertices.push(new THREE.Vector3(x1, y2, 0));
    square.vertices.push(new THREE.Vector3(x2, y1, 0));
    square.vertices.push(new THREE.Vector3(x2, y2, 0));

    square.faces.push(new THREE.Face3(0, 1, 2));
    square.faces.push(new THREE.Face3(1, 2, 3));
    return square;
}

function placeSquare(square_mesh, relativeX, relativeY, relativeZ) {
    if (relativeX != undefined) {
        square_mesh.position.x = square_mesh.position.x + relativeX;
    }

    if (relativeY != undefined) {
        square_mesh.position.y = square_mesh.position.y + relativeY;
    }

    if (relativeZ != undefined) {
        square_mesh.position.z = square_mesh.position.z + relativeZ;
    }
    return square_mesh;
}

function createAndPlaceSquare(material, relativeX, relativeY, relativeZ) {
    var geometry = drawSquare(0.5, 0.5, 1.5, 1.5);
    relativeX = relativeX || undefined;
    relativeY = relativeY || undefined;
    relativeZ = relativeZ || undefined;

    var square_mesh = new THREE.Mesh(geometry, material);
    square_mesh.rotation.x = Math.PI / 2;
    return placeSquare(square_mesh, relativeX, relativeY, relativeZ);
}

function getSquareCoordinates(square) {
    var topLeft = new THREE.Vector2(),
        topRight = new THREE.Vector2(),
        bottomLeft = new THREE.Vector2(),
        bottomRight = new THREE.Vector2();

    var center = square.getWorldPosition();
    var size = getSquareSize(square);

    console.log(size, center);

    topLeft.x = center.x - ((size.width).toFixed(1) / 2);
    topLeft.y = center.y + ((size.heigth).toFixed(1) / 2);
    topRight.x = center.x + ((size.width).toFixed(1) / 2);
    topRight.y = center.y + ((size.heigth).toFixed(1) / 2);
    bottomLeft.x = center.x - ((size.width).toFixed(1) / 2);
    bottomLeft.y = center.y - ((size.heigth).toFixed(1) / 2);
    bottomRight.x = center.x + ((size.width).toFixed(1) / 2);
    bottomRight.y = center.y - ((size.heigth).toFixed(1) / 2);


    return {
        topLeft: topLeft,
        topRight: topRight,
        bottomLeft: bottomLeft,
        bottomRight: bottomRight
    }
}

function getSquareSize(square) {
    square.geometry.computeBoundingBox()

    var size = square.geometry.boundingBox.getSize();

    return {
        width: size.x,
        heigth: size.y
    }
}

function loadTexture(element, texture) {
    console.log(element, texture);

    textureLoader.load(texture, function (texture) {
        console.log(element.material);
        element.color = undefined;
        element.material.map = texture;
        element.material.needsUpdate = true;
    })
}

function render() {
    if (renderer != undefined) {
        renderer.render(scene, camera);
    }
}


function animate() {
    requestAnimationFrame(animate);
    render();
}
