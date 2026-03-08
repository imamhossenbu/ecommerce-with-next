import React from 'react'
import Bestsellers from '@/app/_components/BestSeller'
import JoinCommunity from '@/components/JoinCommunity'
import ProductDetailsView from './_components/ProductDetailsView';



export default async function ProductDetails({params}) {

  const { id } = await params;
  console.log(id);
  return (
    <div>
        <ProductDetailsView id={id}/>
        <Bestsellers/>
        <JoinCommunity/>
    </div>
  )
}
