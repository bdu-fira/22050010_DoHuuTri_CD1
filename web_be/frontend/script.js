document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i> Danh mục';
    
    const categoryNav = document.querySelector('.category-nav .container');
    categoryNav.prepend(menuToggle);
    
    const categoryMenu = document.querySelector('.category-menu');
    
    menuToggle.addEventListener('click', function() {
        categoryMenu.classList.toggle('active');
    });
    
    // Mobile Submenu Toggle
    if (window.innerWidth <= 991) {
        const menuItems = document.querySelectorAll('.menu-item > a');
        
        menuItems.forEach(item => {
            const chevron = item.querySelector('i');
            const submenu = item.nextElementSibling;
            
            if (chevron && submenu) {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    chevron.classList.toggle('fa-chevron-up');
                    chevron.classList.toggle('fa-chevron-down');
                    submenu.classList.toggle('active');
                });
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Thumbnail image switching
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainImage');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Change main image
            const thumbImg = this.querySelector('img');
            mainImage.src = thumbImg.src.replace('-thumb', '-main');
        });
    });
    
    // Tab switching
    const tabHeaders = document.querySelectorAll('.tab-headers li');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all headers and contents
            tabHeaders.forEach(h => h.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked header and corresponding content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Quantity selector
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const qtyInput = document.querySelector('.quantity-selector input');
    
    minusBtn.addEventListener('click', function() {
        let value = parseInt(qtyInput.value);
        if (value > 1) {
            qtyInput.value = value - 1;
        }
    });
    
    plusBtn.addEventListener('click', function() {
        let value = parseInt(qtyInput.value);
        if (value < 10) {
            qtyInput.value = value + 1;
        }
    });
    
    // FAQ accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
        });
    });
});



/* lo gin */
document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Switch between login and register forms
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (showRegister && showLogin) {
        showRegister.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
        });

        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
        });
    }

    // Form validation
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate register form
            if (form.contains(document.getElementById('register-password'))) {
                const password = document.getElementById('register-password').value;
                const confirm = document.getElementById('register-confirm').value;
                
                if (password !== confirm) {
                    alert('Mật khẩu không khớp! Vui lòng nhập lại.');
                    return;
                }
            }
            
            // Form is valid, you can add AJAX submission here
            alert('Form submitted successfully!');
            // form.submit(); // Uncomment this to actually submit the form
        });
    });
});



// giỏ hàng
document.addEventListener('DOMContentLoaded', function() {
    // Quantity controls
    const minusButtons = document.querySelectorAll('.qty-btn.minus');
    const plusButtons = document.querySelectorAll('.qty-btn.plus');
    const quantityInputs = document.querySelectorAll('.qty-input');
    
    minusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.nextElementSibling;
            let value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
                updateItemTotal(this.closest('.cart-item'));
            }
        });
    });
    
    plusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            let value = parseInt(input.value);
            if (value < 10) {
                input.value = value + 1;
                updateItemTotal(this.closest('.cart-item'));
            }
        });
    });
    
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value < 1) this.value = 1;
            if (this.value > 10) this.value = 10;
            updateItemTotal(this.closest('.cart-item'));
        });
    });
    
    // Remove item
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
                this.closest('.cart-item').remove();
                updateCartSummary();
            }
        });
    });
    
    // Save for later
    const saveButtons = document.querySelectorAll('.save-btn');
    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const item = this.closest('.cart-item');
            alert('Sản phẩm đã được lưu vào mục Yêu thích');
            item.remove();
            updateCartSummary();
        });
    });
    
    // Update cart
    document.querySelector('.update-cart')?.addEventListener('click', function() {
        alert('Giỏ hàng đã được cập nhật');
        updateCartSummary();
    });
    
    // Apply promo code
    document.querySelector('.apply-btn')?.addEventListener('click', function() {
        const promoCode = this.previousElementSibling.value;
        if (promoCode) {
            alert(`Áp dụng mã giảm giá "${promoCode}" thành công`);
            updateCartSummary();
        } else {
            alert('Vui lòng nhập mã giảm giá');
        }
    });
    
    // Helper function to update item total
    function updateItemTotal(item) {
        const price = parseFloat(item.querySelector('.item-price').textContent.replace(/[^\d]/g, '')) / 1000;
        const quantity = parseInt(item.querySelector('.qty-input').value);
        const total = price * quantity;
        item.querySelector('.item-total').textContent = total.toLocaleString('vi-VN') + '₫';
        updateCartSummary();
    }
    
    // Helper function to update cart summary
    function updateCartSummary() {
        let subtotal = 0;
        document.querySelectorAll('.item-total').forEach(total => {
            subtotal += parseFloat(total.textContent.replace(/[^\d]/g, '')) / 1000;
        });
        
        // In a real app, you would calculate discount and shipping based on business rules
        const discount = 300000; // Example fixed discount
        const shipping = 0; // Free shipping
        
        const total = subtotal - discount + shipping;
        
        document.querySelector('.summary-row:nth-child(2) span:last-child').textContent = 
            subtotal.toLocaleString('vi-VN') + '₫';
        document.querySelector('.summary-row:nth-child(3) span:last-child').textContent = 
            '-' + (discount / 1000).toLocaleString('vi-VN') + '₫';
        document.querySelector('.summary-row.total span:last-child').textContent = 
            total.toLocaleString('vi-VN') + '₫';
    }
    
    // Initialize cart summary
    updateCartSummary();
});





//Thanh toán
document.addEventListener('DOMContentLoaded', function() {
    // Step navigation
    const steps = document.querySelectorAll('.step');
    const stepContents = document.querySelectorAll('.checkout-step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    
    // Initialize first step
    showStep(1);
    
    // Next button click
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = getCurrentStep();
            const nextStep = parseInt(this.getAttribute('data-next'));
            
            if (validateStep(currentStep)) {
                showStep(nextStep);
                updateStepIndicator(nextStep);
                updateOrderReview();
            }
        });
    });
    
    // Previous button click
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = parseInt(this.getAttribute('data-prev'));
            showStep(prevStep);
            updateStepIndicator(prevStep);
        });
    });
    
    // Step click
    steps.forEach(step => {
        step.addEventListener('click', function() {
            const stepNumber = parseInt(this.getAttribute('data-step'));
            const currentStep = getCurrentStep();
            
            if (stepNumber < currentStep) {
                showStep(stepNumber);
                updateStepIndicator(stepNumber);
            }
        });
    });
    
    // City change
    document.getElementById('city')?.addEventListener('change', function() {
        const city = this.value;
        const districtSelect = document.getElementById('district');
        
        // Clear previous districts
        districtSelect.innerHTML = '<option value="">Chọn Quận/Huyện</option>';
        
        // Add districts based on city (in a real app, this would be AJAX)
        if (city === 'hcm') {
            addDistrict(districtSelect, 'q1', 'Quận 1');
            addDistrict(districtSelect, 'q2', 'Quận 2');
            addDistrict(districtSelect, 'q3', 'Quận 3');
            // Add more districts...
        } else if (city === 'hn') {
            addDistrict(districtSelect, 'hk', 'Quận Hoàn Kiếm');
            addDistrict(districtSelect, 'bd', 'Quận Ba Đình');
            addDistrict(districtSelect, 'hbt', 'Quận Hai Bà Trưng');
            // Add more districts...
        }
    });
    
    // Submit order
    document.querySelector('.btn-submit')?.addEventListener('click', function() {
        if (validateStep(3)) {
            if (document.getElementById('agree-terms').checked) {
                alert('Đơn hàng của bạn đã được đặt thành công! Cảm ơn bạn đã mua sắm tại Toy World.');
                // In a real app, you would submit the form here
                // window.location.href = 'order-success.html';
            } else {
                alert('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật');
            }
        }
    });
    
    // Helper functions
    function showStep(stepNumber) {
        stepContents.forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`step-${stepNumber}`).classList.add('active');
    }
    
    function updateStepIndicator(stepNumber) {
        steps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.getAttribute('data-step')) <= stepNumber) {
                step.classList.add('active');
            }
        });
    }
    
    function getCurrentStep() {
        const activeStep = document.querySelector('.checkout-step.active');
        return parseInt(activeStep.id.split('-')[1]);
    }
    
    function validateStep(stepNumber) {
        let isValid = true;
        
        if (stepNumber === 1) {
            const requiredFields = document.querySelectorAll('#step-1 [required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#dc3545';
                    isValid = false;
                } else {
                    field.style.borderColor = '#ddd';
                }
            });
            
            if (!isValid) {
                alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            }
        }
        
        return isValid;
    }
    
    function addDistrict(selectElement, value, text) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        selectElement.appendChild(option);
    }
    
    function updateOrderReview() {
        // Update shipping info
        if (document.getElementById('fullname').value) {
            const shippingInfo = `
                <p><strong>${document.getElementById('fullname').value}</strong></p>
                <p>${document.getElementById('phone').value}</p>
                <p>${document.getElementById('address').value}</p>
                <p>${document.getElementById('city').options[document.getElementById('city').selectedIndex].text}, 
                ${document.getElementById('district').options[document.getElementById('district').selectedIndex].text}</p>
                ${document.getElementById('email').value ? `<p>${document.getElementById('email').value}</p>` : ''}
                ${document.getElementById('note').value ? `<p><strong>Ghi chú:</strong> ${document.getElementById('note').value}</p>` : ''}
            `;
            document.getElementById('shipping-review').innerHTML = shippingInfo;
        }
        
        // Update payment method
        const selectedPayment = document.querySelector('input[name="payment"]:checked');
        if (selectedPayment) {
            let paymentMethod = '';
            if (selectedPayment.id === 'cod') {
                paymentMethod = 'Thanh toán khi nhận hàng (COD)';
            } else if (selectedPayment.id === 'bank') {
                paymentMethod = 'Chuyển khoản ngân hàng';
            } else if (selectedPayment.id === 'momo') {
                paymentMethod = 'Ví điện tử Momo';
            } else if (selectedPayment.id === 'zalopay') {
                paymentMethod = 'ZaloPay';
            }
            document.getElementById('payment-review').textContent = paymentMethod;
        }
    }
});

// user
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const menuLinks = document.querySelectorAll('.account-menu a');
    const tabs = document.querySelectorAll('.account-tab');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and tabs
            menuLinks.forEach(l => l.parentElement.classList.remove('active'));
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked link
            this.parentElement.classList.add('active');
            
            // Show corresponding tab
            const tabId = this.getAttribute('href').substring(1);
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Address management
    const btnAddAddress = document.querySelector('.btn-add-address');
    const addressForm = document.querySelector('.address-form');
    
    if (btnAddAddress && addressForm) {
        btnAddAddress.addEventListener('click', function() {
            addressForm.style.display = 'block';
            this.parentElement.style.display = 'none';
        });
        
        document.querySelector('.btn-cancel')?.addEventListener('click', function() {
            addressForm.style.display = 'none';
            document.querySelector('.add-address-card').style.display = 'flex';
        });
    }
    
    // City and district selection
    const citySelect = document.getElementById('city');
    const districtSelect = document.getElementById('district');
    
    if (citySelect && districtSelect) {
        citySelect.addEventListener('change', function() {
            const city = this.value;
            districtSelect.innerHTML = '<option value="">Chọn Quận/Huyện</option>';
            
            if (city === 'hcm') {
                addDistrict('q1', 'Quận 1');
                addDistrict('q2', 'Quận 2');
                addDistrict('q3', 'Quận 3');
                // Add more districts...
            } else if (city === 'hn') {
                addDistrict('hk', 'Quận Hoàn Kiếm');
                addDistrict('bd', 'Quận Ba Đình');
                addDistrict('hbt', 'Quận Hai Bà Trưng');
                // Add more districts...
            }
        });
        
        function addDistrict(value, text) {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = text;
            districtSelect.appendChild(option);
        }
    }
    
    // Avatar upload preview
    const avatarUpload = document.getElementById('avatar-upload');
    const avatarPreview = document.querySelector('.avatar-preview img');
    
    if (avatarUpload && avatarPreview) {
        avatarUpload.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarPreview.src = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        });
        
        document.querySelector('.btn-remove')?.addEventListener('click', function() {
            avatarPreview.src = 'images/avatar-default.jpg';
            avatarUpload.value = '';
        });
    }
    
    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Password confirmation check
            if (form.classList.contains('password-form')) {
                const newPassword = document.getElementById('new-password').value;
                const confirmPassword = document.getElementById('confirm-password').value;
                
                if (newPassword !== confirmPassword) {
                    alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
                    return;
                }
            }
            
            // In a real app, you would submit the form here
            alert('Thông tin đã được cập nhật thành công!');
            // form.submit();
        });
    });
    
    // Remove address
    const removeAddressButtons = document.querySelectorAll('.btn-remove');
    removeAddressButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
                this.closest('.address-card').remove();
            }
        });
    });
    
    // Set default address
    const setDefaultButtons = document.querySelectorAll('.btn-set-default');
    setDefaultButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.address-card').forEach(card => {
                card.classList.remove('default');
            });
            this.closest('.address-card').classList.add('default');
        });
    });
    
    // Remove wishlist item
    const removeWishlistButtons = document.querySelectorAll('.btn-remove-wishlist');
    removeWishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi danh sách yêu thích?')) {
                this.closest('.wishlist-item').remove();
                
                // Show empty state if no items left
                if (document.querySelectorAll('.wishlist-item').length === 0) {
                    document.querySelector('.empty-wishlist').style.display = 'block';
                }
            }
        });
    });
});


//giới thiệu

document.addEventListener('DOMContentLoaded', function() {
    // Animate achievement numbers
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateNumbers() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000; // Animation duration in ms
            const step = target / (duration / 16); // 60fps
            
            let current = 0;
            const increment = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(increment);
                } else {
                    stat.textContent = target;
                }
            };
            
            increment();
        });
    }
    
    // Only animate when section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(document.querySelector('.achievements'));
    
    // Testimonial slider navigation
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        testimonialSlider.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - testimonialSlider.offsetLeft;
            scrollLeft = testimonialSlider.scrollLeft;
        });
        
        testimonialSlider.addEventListener('mouseleave', () => {
            isDown = false;
        });
        
        testimonialSlider.addEventListener('mouseup', () => {
            isDown = false;
        });
        
        testimonialSlider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - testimonialSlider.offsetLeft;
            const walk = (x - startX) * 2;
            testimonialSlider.scrollLeft = scrollLeft - walk;
        });
        
        // Touch events for mobile
        testimonialSlider.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - testimonialSlider.offsetLeft;
            scrollLeft = testimonialSlider.scrollLeft;
        });
        
        testimonialSlider.addEventListener('touchend', () => {
            isDown = false;
        });
        
        testimonialSlider.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - testimonialSlider.offsetLeft;
            const walk = (x - startX) * 2;
            testimonialSlider.scrollLeft = scrollLeft - walk;
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});


//admin
document.addEventListener('DOMContentLoaded', function() {
    // Toggle sidebar on mobile
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const adminSidebar = document.querySelector('.admin-sidebar');
    const adminMain = document.querySelector('.admin-main');
    
    sidebarToggle.addEventListener('click', function() {
        adminSidebar.classList.toggle('active');
        adminMain.classList.toggle('active');
    });
    
    // Switch between menu items
    const menuItems = document.querySelectorAll('.sidebar-menu li a');
    const contentSections = document.querySelectorAll('.admin-content');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all menu items
            menuItems.forEach(i => i.parentElement.classList.remove('active'));
            
            // Add active class to clicked menu item
            this.parentElement.classList.add('active');
            
            // Update page title
            const pageTitle = this.querySelector('span').textContent;
            document.querySelector('.admin-header h1').textContent = pageTitle;
            
            // Hide all content sections
            contentSections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show the selected content section
            const target = this.getAttribute('href');
            document.querySelector(target + '-content').style.display = 'block';
        });
    });
    
    // Simulate loading data for dashboard
    function loadDashboardData() {
        // In a real app, you would fetch this data from an API
        console.log('Loading dashboard data...');
    }
    
    // Initialize the dashboard
    loadDashboardData();
    
    // Simulate chart loading
    setTimeout(() => {
        const chartPlaceholders = document.querySelectorAll('.chart-placeholder');
        chartPlaceholders.forEach(chart => {
            chart.innerHTML = '<p>Biểu đồ sẽ được hiển thị ở đây</p>';
        });
    }, 1000);
});