import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import eventImage1 from '@/assets/images/event1.png'
import eventImage2 from '@/assets/images/event2.png'
import eventImage3 from '@/assets/images/event3.png'
import eventImage4 from '@/assets/images/event4.png'
import eventImage5 from '@/assets/images/event5.png'

export const Events = () => {
  return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center" style={{ marginBottom: '40px' }}>A better way to host 
              <span 
              style={{
                background: 'linear-gradient(90deg, #67CCEA 70.99%, #E397F2 87.11%, #FABA64 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                WebkitTextFillColor: 'transparent',
                marginLeft: '10px'
              }}
            > Events</span>
          </h2>

          <div className="grid-columns-main-area">
            <div className="grid-cols-main-card">
              <div className="card-main-area">
                  <h3 className="title-text-main">Find Events around you</h3>
                  <p>Don’t miss out on live changing events. Festifa brings all the events <br/> happpening around you to one center place</p>
                  <Button className="comman-black-button">
                    Checkout upcoming events 
                    <ArrowRight />
                  </Button>
                  <div className="img-box">
                    <img src={eventImage1} alt="" width="100%" />
                  </div>
              </div>
            </div>
            <div className="grid-cols-main-card">
              <div className="card-main-area" style={{ background: '#D2F0F9', paddingRight: '0' }}>
                  <h3 className="title-text-main">Host Events better</h3>
                  <p>Hosting events is easier with Festifa, Customize your event just <br/> how you want it, send invites, get resposes and many more.</p>
                  <Button className="comman-black-button">
                    Create event 
                    <ArrowRight />
                  </Button>
                  <div className="img-box">
                    <img src={eventImage2} alt="" width="100%" />
                  </div>
              </div>
            </div>
            <div className="grid-cols-main-card">
              <div className="card-main-area" style={{ background: '#DDD9F2', paddingRight: '0' }}>
                  <h3 className="title-text-main">Choose any Design </h3>
                  <p>we have a range of diverse templates you can use as <br/> designs for your event</p>
                  <Button className="comman-black-button">
                    View all templates
                    <ArrowRight />
                  </Button>
                  <div className="img-box">
                    <img src={eventImage3} alt="" width="100%" />
                  </div>
              </div>
            </div>
            <div className="grid-cols-main-card">
              <div className="card-main-area" style={{ background: '#E0EFFF' }}>
                  <h3 className="title-text-main">Get tickets to events too</h3>
                  <p>some descriptive text</p>
                  <Button className="comman-black-button">
                    Browse events
                    <ArrowRight />
                  </Button>
                  <div className="img-box">
                    <img src={eventImage4} alt=""  style={{ width: '95%', margin: 'auto' }} />
                  </div>
              </div>
            </div>
            <div className="grid-cols-main-card">
              <div className="card-main-area" style={{ background: '#FFE0ED', paddingRight: '0' }}>
                  <h3 className="title-text-main">Available on Web and mobile</h3>
                  <p>some descriptive text</p>
                  <Button className="comman-black-button">
                    Download app
                    <ArrowRight />
                  </Button>
                  <div className="img-box">
                    <img src={eventImage5} alt="" width="100%" />
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
  )
}
