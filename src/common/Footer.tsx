
// import "./Footer.css";
import "tailwindcss";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";


function Footer() {
  return (
    <div style={{background: "#071831"}}>
    
        <div style = {{width: "100%", display: "flex", flexFlow: "row wrap", justifyContent: "space-evenly", padding: "1rem"}}>

            {/* <div style = {{width: "23%", color: "white"}}>
                hi
            </div> */}

            <div style = {{width: "23%", color: "white"}}>
                <div className="font-extrabold">Quick Links</div>
                <div >About Us</div>
                <div className="font-medium ">Contact Us</div>
                <div >FAQ</div>
                <div >Blog</div>
                <div >Support</div>
            </div>

            <div style = {{width: "23%", color: "white"}}>
                <div className="font-bold">Follow Us</div>
                <div>Facebook</div>
                <div>Twitter</div>
                <div>Instagram</div>
                <div>LinkedIn</div>
                <div>YouTube</div>
            </div>

            <div style = {{width: "23%", color: "white"}}>
                <div className="font-bold">Stay Updated</div>
                <div >Newsletter</div>
                <div >Offers</div>
                <div >News</div>
                <div >Events</div>
                <div >Updates</div>
            </div>

        </div>

        {/* <br/>
        <div>
            
        </div> */}
         <footer className="border-t border-gray-200 dark:border-gray-700 py-6">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
                <div className="flex flex-col md:flex-row items-center text-sm text-gray-500 dark:text-gray-400 space-y-2 md:space-y-0 md:space-x-4">
                <span>© {new Date().getFullYear()} Relume. All rights reserved.</span>
                <a href="/privacy" className="hover:underline">Privacy Policy</a>
                <a href="/terms" className="hover:underline">Terms of Service</a>
                <a href="/cookies" className="hover:underline">Cookie Settings</a>
                </div>
                <div className="flex space-x-4 mt-4 md:mt-0">
                <a
                    href="https://facebook.com"
                    aria-label="Facebook"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <Facebook size={20} />
                </a>
                <a
                    href="https://instagram.com"
                    aria-label="Instagram"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <Instagram size={20} />
                </a>
                <a
                    href="https://twitter.com"
                    aria-label="Twitter"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <Twitter size={20} />
                </a>
                <a
                    href="https://linkedin.com"
                    aria-label="LinkedIn"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <Linkedin size={20} />
                </a>
                <a
                    href="https://youtube.com"
                    aria-label="YouTube"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <Youtube size={20} />
                </a>
                </div>
            </div>
            </footer>

    </div>


    
  )
}

export default Footer
