const Banner = require('../../models/bannerModel')

const loadbannerManagement=async(req,res)=>{
    try{
      const bannerData=await Banner.find()
      
      res.render('bannerManegment',{banner:bannerData})
    }catch(error){
      console.log(error.messaage);
    }
}

const addBanner=async(req,res)=>{
    try{
        const newBanner = req.body.banner
        const a=req.files
        const banner=new Banner({
          banner:newBanner,
          bannerImage:a.map((x)=>x.filename)
        })
        const bannerData=await banner.save()
        if(bannerData){
          res.redirect('loadbannerManagement')
        }
    }catch(error){
      console.log(error.messaage);
    }
}

const chooseBanner=async(req,res)=>{
    try{
      const id=req.query.id
    await Banner.findOneAndUpdate({is_active:1},{$set:{is_active:0}})
    await Banner.findByIdAndUpdate({ _id: id },{$set:{is_active:1}})
    //   }
      res.redirect('loadbannerManagement')
      
      
    }catch(error){
      console.log(error);
  
    }
  }

  const deleteBanner=async(req,res)=>{
    try{
      const id=req.query.id;
      await Banner.deleteOne({_id:id})
      res.redirect('loadbannerManagement')
  
  
    }catch(error){
      console.log(error);
    }
  }
  

module.exports = {
    loadbannerManagement,
    addBanner,
    chooseBanner,
    deleteBanner
    
}