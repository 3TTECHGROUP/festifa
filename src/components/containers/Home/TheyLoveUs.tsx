// import { type JSX } from 'react'
import companyLogo from '@/assets/images/company-logo.png'

// interface Company {
//   id: number
//   name: string
//   logo: JSX.Element
// }

// const companies: Company[] = [
//   {
//     id: 1,
//     name: "DHL",
//     logo: (
//       <svg className="h-12 w-auto" viewBox="0 0 120 40" fill="none">
//         <text x="10" y="25" className="fill-gray-600 font-bold text-lg">DHL</text>
//       </svg>
//     )
//   },
//   {
//     id: 2,
//     name: "Google",
//     logo: (
//       <svg className="h-12 w-auto" viewBox="0 0 120 40" fill="none">
//         <text x="10" y="25" className="fill-gray-600 font-medium text-lg">Google</text>
//       </svg>
//     )
//   },
//   {
//     id: 3,
//     name: "Stripe",
//     logo: (
//       <svg className="h-12 w-auto" viewBox="0 0 120 40" fill="none">
//         <text x="10" y="25" className="fill-gray-600 font-medium text-lg">stripe</text>
//       </svg>
//     )
//   },
//   {
//     id: 4,
//     name: "AT&T",
//     logo: (
//       <svg className="h-12 w-auto" viewBox="0 0 120 40" fill="none">
//         <circle cx="20" cy="20" r="3" className="fill-gray-600"/>
//         <text x="30" y="25" className="fill-gray-600 font-medium text-lg">AT&T</text>
//       </svg>
//     )
//   },
//   {
//     id: 5,
//     name: "Toyota",
//     logo: (
//       <svg className="h-12 w-auto" viewBox="0 0 120 40" fill="none">
//         <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-600"/>
//         <text x="35" y="25" className="fill-gray-600 font-medium text-lg">TOYOTA</text>
//       </svg>
//     )
//   }
// ]

export const TheyLoveUs = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-12">
          They love us
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16 opacity-60">
            <img src={companyLogo} alt="" />
        </div>

        {/* Lateron Implement Below Code */}
        {/* <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16 opacity-60">
          {companies.map((company) => (
            <div key={company.id} className="flex items-center justify-center h-12">
              {company.logo}
            </div>
          ))}
        </div> */}
      </div>
    </section>
  )
}
