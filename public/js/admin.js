const deleteProduct = function(button) {
    let csrf = button.parentNode.querySelector('[name=_csrf]').value;
    let productId = button.parentNode.querySelector('[name=productId]').value;
    let product = button.closest('article')
    fetch('/admin/product/'+productId,{
        method:'DELETE',
        headers:{
            'csrf-token':csrf
        }
    }).then((response)=>{
        console.log('response',response.body);
        product.parentNode.removeChild(product);
    })
    .catch((err)=>{
        console.log('err',err)
    })
}