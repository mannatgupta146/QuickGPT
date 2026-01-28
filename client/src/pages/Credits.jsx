import React, { useEffect, useState } from 'react'
import { dummyPlans } from '../assets/assets'
import Loading from './Loading'

const Credits = () => {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPlans = async () => {
    setPlans(dummyPlans)
    setLoading(false)
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  if (loading) return <Loading />

  return (
    <div className='max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <h2 className='text-3xl font-semibold text-center mb-12 xl:mt-20 text-gray-800 dark:text-white'>
        Credit Plans
      </h2>

      <div className='flex flex-wrap justify-center gap-10'>
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`relative rounded-2xl p-7 min-w-[320px] max-w-sm flex flex-col transition-all duration-300
              hover:-translate-y-1 hover:shadow-xl
              ${
                plan._id === 'pro'
                  ? 'border border-purple-500 bg-gradient-to-br from-purple-600 to-purple-800 text-white shadow-[0_25px_50px_rgba(128,90,213,0.35)]'
                  : 'border border-gray-200 bg-white text-gray-900 shadow-[0_12px_30px_rgba(0,0,0,0.08)] dark:border-purple-700 dark:bg-[#1b1128] dark:text-purple-100 dark:shadow-[0_15px_40px_rgba(0,0,0,0.6)]'
              }`}
          >
            {plan._id === 'pro' && (
              <span className='absolute top-4 right-4 text-xs font-semibold tracking-wide bg-white/20 px-3 py-1 rounded-full'>
                Most Popular
              </span>
            )}

            {/* Header */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-1'>
                {plan.name}
              </h3>

              <p
                className={`text-3xl font-bold ${
                  plan._id === 'pro'
                    ? 'text-white'
                    : 'text-purple-600 dark:text-purple-300'
                }`}
              >
                ${plan.price}
                <span className='text-sm font-medium opacity-80'>
                  {' '}
                  / {plan.credits} credits
                </span>
              </p>
            </div>

            {/* Features */}
            <ul className={`flex-1 space-y-2 text-sm leading-relaxed
              ${
                plan._id === 'pro'
                  ? 'text-purple-100'
                  : 'text-gray-700 dark:text-purple-200'
              }`}
            >
              {plan.features.map((feature, index) => (
                <li key={index} className='flex items-start gap-2'>
                  <span className='text-purple-400 text-xl leading-none'>•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Button */}
            <button
              className={`mt-8 py-2.5 rounded-lg font-medium transition-colors
                ${
                  plan._id === 'pro'
                    ? 'bg-white text-purple-700 hover:bg-purple-100 active:bg-purple-200'
                    : 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800'
                }`}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Credits
