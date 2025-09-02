const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            Get in touch with our team
          </p>
        </div>
        
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Get in Touch</h3>
              <div className="space-y-2">
                <p className="flex items-center">
                  <span className="font-medium mr-2">Email:</span>
                  <a href="mailto:hello@festifa.com" className="text-primary hover:underline">
                    hello@festifa.com
                  </a>
                </p>
                <p className="flex items-center">
                  <span className="font-medium mr-2">Phone:</span>
                  <a href="tel:+1234567890" className="text-primary hover:underline">
                    +1 (234) 567-890
                  </a>
                </p>
                <p className="flex items-start">
                  <span className="font-medium mr-2">Address:</span>
                  <span>123 Business St, Suite 100<br />City, State 12345</span>
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Business Hours</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Monday - Friday:</span> 9:00 AM - 6:00 PM</p>
                <p><span className="font-medium">Saturday:</span> 10:00 AM - 4:00 PM</p>
                <p><span className="font-medium">Sunday:</span> Closed</p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4">Send us a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="border border-input px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="border border-input px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                className="w-full border border-input px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                placeholder="Your Message"
                rows={5}
                className="w-full border border-input px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
