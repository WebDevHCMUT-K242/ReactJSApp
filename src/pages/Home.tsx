
import Footer from "../common/Footer";
import "./Home.css";

function Home() {
  return (
    <div>
      <div className="main-container">
        <text className={"main-text"} style = {{color: "white"}}>
          Discover Our Exlcusive Offers and Bestsellers
        </text>
              <text className={"sub-text"} style = {{paddingBottom: "2rem", color: "White"}}>
          Explore our handpicked selection of top products designed to elevate your shopping experience.
          Don’t miss out on limited-time promotions that bring you the best value.        
        </text>
        <div style = {{
          width: "80%",
        }}>

			<div style={{
				width: "100%",
				paddingBottom: "3rem",
				display: "flex",
				flexFlow: "row wrap",
				justifyContent: "center"
			}}>
				<a href="" className="btn btn-success" style={{marginRight: "0.25rem"}}>Shop</a>
				<a href="" className="btn btn-light" style={{marginLeft: "0.25rem"}}>Learn More</a>
			</div>

			<img src="home-img.png" style={{objectFit: "fill", width: "100%"}} />

		  	
        </div>
      </div>      

      <div style = {{background: "navy"}}>

          <div className="myContainer v2">
            <div style = {{width: "45%"}}>
              <text className="sub-text" style = {{color: "white"}}>Experience unmatched quality and service</text>
            </div>
            <div style = {{width: "45%"}}>
              <text style = {{color: "white"}}> Our commitment to fast shipping ensures that your orders arrive on time, every time. We source only high-quality products, so you can shop with confidence. With our dedicated customer service team, your satisfaction is our top priority.</text>
            </div>
          </div>

          <div style = {{
              display: "flex",
              flexFlow: "row wrap",
              width: "100%",
              justifyContent: "center",
              paddingBottom: "10rem",
			        margin: '0'
            }}>
            <div style = {{width: "30%", display: "flex", flexFlow: "row wrap", justifyContent: "flex-start"}}>
              	<text className="sub-text v2">Fast Shipping to Your Doorstep</text>
				<text style = {{color: "white"}}>Get your orders delivered swiftly and reliably.</text>
            </div>

            <div style = {{width: "30%", display: "flex", flexFlow: "row wrap", justifyContent: "flex-start"}}>
              	<text className="sub-text v2">Top-Quality Products You Can Trust</text>
			  	<text style = {{color: "white"}}>We offer only the best for our customers.</text>
            </div>

            <div style = {{width: "30%", display: "flex", flexFlow: "row wrap", justifyContent: "flex-start"}}>
              	<text className="sub-text v2">Exceptional Customer Service, Always Here For You</text>
				<text style = {{color: "white", paddingTop: "1rem"}}>Our team is ready to assist you 24/7.</text>
            </div>

          </div>

      </div>

      <div style={{background: "#071831"}}>
        <div className="myContainer v2">
            <div style = {{width: "45%", display: "flex", flexFlow: "column wrap", justifyContent: "center", position: "relative"}}>

              <text className="sub-text" style = {{color: "white", fontSize: "2rem"}}>
                Discover Our Best-Selling Products That Customers Can't Get Enough Of!
                </text>

              <text style = {{color: "white", paddingTop: "1rem"}}> 
                Explore our curated selection of top-selling items that combine quality
                and value. Each product is designed to meet your needs and enhance
                your shopping experience.
                </text>

            </div>

            <div style = {{width: "45%"}}>
			    <img src="home-img.png" style={{objectFit: "fill", width: "100%"}} />

            </div>
        </div>
        
      </div>

    </div>
  )
}

export default Home
