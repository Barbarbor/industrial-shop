

export const getName = (data) => (params) => {
    const item = data?.find((i) => i.id === params.value);
    return item ? item?.name : 'Unknown';
  };
export const getFullBuyerName = () => (params) => {
    return `${params.row.buyer.name} ${params.row.buyer.surname}`
}   
export const getFullSellerName = () => (params) => {
    return `${params.row.seller.name} ${params.row.seller.surname}`
}   
export const getProductName = () => (params) => {
    return `${params.row.product.name}`
} 
export const getFormattedTime = (params) => params.value.slice(0, 5);
export const getFormattedDate = (params) => new Date(params.value).toLocaleDateString('en-GB');
  