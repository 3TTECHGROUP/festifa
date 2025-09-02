const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">About Festifa</h1>
          <p className="text-xl text-muted-foreground">
            Learn more about our mission and values
          </p>
        </div>
        
        <div className="prose prose-lg mx-auto">
          <p>
            Festifa is dedicated to providing exceptional experiences and innovative solutions 
            for our customers. We believe in the power of technology to transform lives and 
            create meaningful connections.
          </p>
          
          <h2>Our Mission</h2>
          <p>
            To deliver outstanding service and create lasting value for our customers through 
            innovation, quality, and dedication.
          </p>
          
          <h2>Our Values</h2>
          <ul>
            <li>Excellence in everything we do</li>
            <li>Customer-first approach</li>
            <li>Innovation and continuous improvement</li>
            <li>Integrity and transparency</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default About
