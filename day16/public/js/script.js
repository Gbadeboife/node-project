document.addEventListener('DOMContentLoaded', function() {
    // Initialize canvas
    const canvas = new fabric.Canvas('canvas', {
        width: 800,
        height: 400
    });

    // Default colors
    const colors = [
        '#FF9AA2', // Soft red
        '#FFB7B2', // Salmon
        '#FFDAC1', // Peach
        '#E2F0CB', // Light green
        '#B5EAD7', // Mint
        '#C7CEEA', // Light blue
        '#9BB7D4', // Steel blue
        '#F2E2FF', // Light purple
        '#F7D794', // Light orange
        '#957DAD'  // Purple
    ];

    const sidebar = document.getElementById('sidebar');
    const fontSize = document.getElementById('fontSize');
    const deleteBtn = document.getElementById('deleteBtn');

    // Menu click handlers
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const type = item.dataset.type;
            updateSidebar(type);
        });
    });

    function setupBackgroundPanel() {
        sidebar.innerHTML = '<div class="colors-container">' +
            colors.map(color => 
                `<div class="color-swatch" style="background-color: ${color}"></div>`
            ).join('') +
            '</div>';

        document.querySelectorAll('.color-swatch').forEach((swatch, i) => {
            swatch.addEventListener('click', () => {
                canvas.setBackgroundColor(colors[i], canvas.renderAll.bind(canvas));
            });
        });
    }

    function setupTextPanel() {
        sidebar.innerHTML = `
            <div class="text-option" data-type="h1">Add a heading</div>
            <div class="text-option" data-type="h6">Add a subheading</div>
            <div class="text-option" data-type="p">Add a line of body text</div>
        `;

        document.querySelectorAll('.text-option').forEach(option => {
            option.addEventListener('click', () => {
                const type = option.dataset.type;
                let fontSize;
                switch(type) {
                    case 'h1':
                        fontSize = 48;
                        break;
                    case 'h6':
                        fontSize = 24;
                        break;
                    default:
                        fontSize = 16;
                }
                
                const text = new fabric.IText('Default Text', {
                    left: canvas.width / 2,
                    top: canvas.height / 2,
                    originX: 'center',
                    originY: 'center',
                    fontSize: fontSize
                });
                canvas.add(text);
                canvas.setActiveObject(text);
                updateControls();
            });
        });
    }

    function setupImagePanel() {
        sidebar.innerHTML = '<div class="image-grid"></div>';
        const imageGrid = sidebar.querySelector('.image-grid');
        
        fetch('https://picsum.photos/v2/list')
            .then(response => response.json())
            .then(images => {
                images.forEach(img => {
                    const imgUrl = `https://picsum.photos/id/${img.id}/200/200`;
                    const imgElement = document.createElement('img');
                    imgElement.src = imgUrl;
                    imgElement.classList.add('image-option');
                    imgElement.addEventListener('click', () => {
                        fabric.Image.fromURL(imgUrl, function(oImg) {
                            const scale = Math.min(
                                (canvas.width * 0.8) / oImg.width,
                                (canvas.height * 0.8) / oImg.height
                            );
                            oImg.scale(scale);
                            oImg.set({
                                left: canvas.width / 2,
                                top: canvas.height / 2,
                                originX: 'center',
                                originY: 'center'
                            });
                            canvas.add(oImg);
                            canvas.setActiveObject(oImg);
                            updateControls();
                        });
                    });
                    imageGrid.appendChild(imgElement);
                });
            });
    }

    function updateSidebar(type) {
        sidebar.className = 'sidebar active';
        
        switch(type) {
            case 'background':
                setupBackgroundPanel();
                break;
            case 'text':
                setupTextPanel();
                break;
            case 'image':
                setupImagePanel();
                break;
        }
    }

    // Control handlers
    fontSize.addEventListener('change', function() {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'i-text') {
            activeObject.set('fontSize', parseInt(this.value));
            canvas.renderAll();
        }
    });

    deleteBtn.addEventListener('click', function() {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.remove(activeObject);
            updateControls();
        }
    });

    canvas.on('selection:created', updateControls);
    canvas.on('selection:cleared', updateControls);

    function updateControls() {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            if (activeObject.type === 'i-text') {
                fontSize.style.display = 'inline';
                fontSize.value = activeObject.fontSize;
            } else {
                fontSize.style.display = 'none';
            }
            deleteBtn.style.display = 'inline';
        } else {
            fontSize.style.display = 'none';
            deleteBtn.style.display = 'none';
        }
    }

    // Download functionality
    document.querySelector('.download-btn').addEventListener('click', function() {
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1
        });
        
        const link = document.createElement('a');
        link.download = 'canvas.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
