class CardWrapper {
  constructor(wrapper) {
    this.wrapper = wrapper; // The .card-wrapper element
    this.productLinks = this.wrapper.querySelectorAll('a'); // The product links
    this.productImages = this.wrapper.querySelectorAll('img'); // The product images
    this.productImage = this.productImages[0]; // The primary image
    this.buttons = this.wrapper.querySelectorAll('button'); // The color buttons
    this.duplicateImage = null; // The secondary image
    this.imageReplacementRegex = /(\.\w+)(\?|$)/; // Match the file extension and query string
    this.secondarySuffix = '-secondary$1$2'; // Add '-secondary' before the file extension
    
    this.init(); 
  }

  init() {
    this.wrapper.addEventListener('click', this.switchColor.bind(this));
    if (!this.productImages[1] && !this.duplicateImage) {
      this.createSecondaryImage();
      this.onHover();
    }
  }

  createSecondaryImage() { // create a duplicate image for the secondary image
    // duplicate the product image
    this.duplicateImage = this.productImage.cloneNode(true);

    // add the duplicate image after the original image
    this.productImage.parentNode.insertBefore(this.duplicateImage, this.productImage.nextSibling);

    this.updateSecondaryImage(this.productImage);
  }

  updateSecondaryImage(product) { // update the duplicate image
    this.duplicateImage.src = product.src.replace(this.imageReplacementRegex, this.secondarySuffix);
    this.duplicateImage.srcset = product.srcset
      .split(',')
      .map(src => src.trim().replace(this.imageReplacementRegex, this.secondarySuffix))
      .join(',');
  }

  onHover() {
    // on hover, show the duplicate image
    this.wrapper.addEventListener('mouseenter', () => {
      this.duplicateImage.style.opacity = '1';
    });
    // on mouseleave, hide the duplicate image
    this.wrapper.addEventListener('mouseleave', () => {
      this.duplicateImage.style.opacity = '0';
    });
  }

  switchColor(event) { 
    // Check if the clicked element is a button
    const button = event.target.closest('button[data-variant-id][data-variant-image]');
    if (!button) return;
    
    const { variantId, variantImage } = button.dataset;
    
    // Update the product link and image
    this.updateProductLink(variantId);
    this.updateProductImage(variantImage);
    
    // Optional: Add active state to the selected button
    this.buttons.forEach((btn) => {
      if (btn.classList.contains('border-black')) {
        btn.classList.remove('border-black');
        btn.classList.add('border-[#E8E8E8]');
      }
    });
    
    button.classList.remove('border-[#E8E8E8]');
    button.classList.add('border-black');
  }

  updateProductLink(variantId) { 
    this.productLinks?.forEach((link) => {
      const baseUrl = link.href.split('?')[0]; // Remove existing query parameters
      link.href = `${baseUrl}?variant=${variantId}`; // Append the variant ID
    });
  }

  updateProductImage(variantImage) { 
    if (!variantImage) return;
    
    const updateImage = (imgElement, src) => {
      if (!imgElement) return;
      imgElement.src = src;
      imgElement.srcset = `${src} 326w, ${src}&width=165 165w`;
    };

    updateImage(this.productImage, variantImage); // Update the primary image
    updateImage(this.duplicateImage, variantImage.replace(this.imageReplacementRegex, this.secondarySuffix)); // Update the secondary image
  }
}

// Initialize the class for each .card-wrapper element
document.querySelectorAll('.card-wrapper').forEach((wrapper) => {
  try {
    new CardWrapper(wrapper);
  } catch (error) {
    console.error('CardWrapper initialization failed:', error);
  }
});