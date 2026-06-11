import React from 'react'
import Header from '../layout/Header'
import HomeBanner from '../UI/HomeBanner'
import Footer from '../layout/Footer'
import Category from '../UI/Category'
import NewlyArrivedBrands from '../UI/NewlyArrivedBrands'
import TrendingProducts from '../UI/TrendingProducts'
import Coupon from '../UI/Coupon'
import Bestsellingproducts from '../UI/Bestsellingproducts'
import Stickers from '../UI/Stickers'
import Mostpopularproducts from '../UI/Mostpopularproducts'
import Justarrived from '../UI/Justarrived'
import OurRecentBlog from '../UI/OurRecentBlog'
import Flex from '../UI/Flex'
import People from '../UI/People'
import Show from '../UI/Show'


const HomePage = () => {
  return (
 <><Header/>
<HomeBanner/>
<Category/>
<NewlyArrivedBrands/>
<TrendingProducts/>
<Coupon/>
<Bestsellingproducts/>
<Stickers/>
<Mostpopularproducts/>
<Justarrived/>
<OurRecentBlog/>
<Flex/>
<People/>
<Show/>
<Footer/></>
  )
}

export default HomePage