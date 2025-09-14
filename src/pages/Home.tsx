import { Banner } from '@/components/containers/Home/Banner'
import { Events } from '@/components/containers/Home/Events'
import { Templates } from '@/components/containers/Home/Templates'
import { TheyLoveUs } from '@/components/containers/Home/TheyLoveUs'
import { TrendingEvents } from '@/components/containers/Home/TrendingEvents'
import './pages.css'
import { HowItWorks } from '@/components/containers/Home/HowItWorks'
import { Newsletter } from '@/components/containers/Home/Newsletter'

const Home = () => {
  return (
      <>
        <Banner />
        <TheyLoveUs />
        <TrendingEvents />
        <Templates />
        <Events />
        <HowItWorks />
        <Newsletter />
      </>
  )
}

export default Home
