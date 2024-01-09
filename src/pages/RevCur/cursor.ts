export function reverseCursor() {
    const style = document.createElement('style');
    style.textContent = `
        #customCursor {
            position: absolute;
            width: 34px;
            height: 34px;
            background: url('data:image/svg+xml,\
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 28 28" enable-background="new 0 0 28 28" xml:space="preserve"> \
                <polygon fill="%23FFFFFF" points="8.2,20.9 8.2,4.9 19.8,16.5 13,16.5 12.6,16.6 "/> \
                <polygon fill="%23FFFFFF" points="17.3,21.6 13.7,23.1 9,12 12.7,10.5 "/> \
                <rect x="12.5" y="13.6" transform="matrix(0.9221 -0.3871 0.3871 0.9221 -5.7605 6.5909)" width="2" height="8"/> \
                <polygon points="9.2,7.3 9.2,18.5 12.2,15.6 12.6,15.5 17.4,15.5 "/> \
            </svg>');
            border-radius: 10px;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    const customCursor = document.createElement('div');
    customCursor.id = 'customCursor';
    document.body.appendChild(customCursor);

    document.body.style.cursor = 'none';

    document.addEventListener('mousemove', (e) => {
        const x = window.innerWidth - e.clientX;
        const y = window.innerHeight - e.clientY;
        customCursor.style.left = x + 'px';
        customCursor.style.top = y + 'px';
    });

    document.addEventListener('click', (e) => {
        const x = window.innerWidth - e.clientX;
        const y = window.innerHeight - e.clientY;
        simulateClick(x, y);
    });
}

function simulateClick(x, y) {
    let elements = document.elementsFromPoint(x, y);
    for (let elem of elements) {
        if (elem.click && elem.classList.contains('box')) {
            elem.click();
            break;
        }
    }
}
