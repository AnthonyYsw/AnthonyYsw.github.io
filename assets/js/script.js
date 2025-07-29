// script.js

document.addEventListener('DOMContentLoaded', function() {
    // 获取所有图片容器
    const photoContainers = document.querySelectorAll('.photo-container');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close');

    // 遍历每一个图片容器
    photoContainers.forEach(container => {
        const thumb = container.querySelector('.thumbnail');
        const exifInfo = container.querySelector('.exif-info');

        // --- 1. 处理EXIF数据显示 ---
        const aperture = thumb.dataset.aperture;
        const shutter = thumb.dataset.shutter;
        const focal = thumb.dataset.focal;
        
        const exifParts = []; // 创建一个空数组来存放EXIF信息
        
        // 如果数据存在，就把它添加到数组里
        if (aperture) {
            exifParts.push(aperture);
        }
        if (shutter) {
            exifParts.push(shutter);
        }
        if (focal) {
            exifParts.push(`${focal}`); // 为focal加上前缀
        }
        
        // 只有当数组不为空时，才把内容显示出来
        if (exifParts.length > 0) {
            exifInfo.textContent = exifParts.join(' · '); // 用一个点来分隔各项数据
        }

        // --- 2. 处理点击放大事件 ---
        thumb.addEventListener('click', function() {
            const largeSrc = this.dataset.largeSrc;
            if (largeSrc) {
                lightboxImg.src = largeSrc;
                lightbox.style.display = 'flex';
            }
        });
    });

    // --- 3. 关闭弹出层的逻辑 (和之前一样) ---
    function closeLightbox() {
        lightbox.style.display = 'none';
    }

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });
});
