'use client'

import { useEffect, useState } from 'react'

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import clsx from 'clsx'

import { Container } from './Container'
import backgroundImage from '../../assets/images/background-features.jpg';

import screenshotExpenses from '../../assets/images/features/expenses.png'
import screenshotPayroll from '../../assets/images/features/payroll.png'
import screenshotReporting from '../../assets/images/features/reporting.png'
import screenshotVatReturns from '../../assets/images/features/vat-returns.png'

import automatedSOXViewSox from '../../assets/images/features/SOX Module.png'
import automatedCompliance from '../../assets/images/features/Compliance Module.png'
import accessRequestModule from '../../assets/images/features/Access Request Module.png'
import userAccessReview from '../../assets/images/features/User Access Review Module.png'

const features = [
  {
    title: 'Automated SOX Testing',
    description:
      "Automatically monitor and validate your SOX controls to ensure continuous compliance, eliminating manual testing and reducing the risk of audit surprises.",
    image: automatedSOXViewSox,
  },
  {
    title: 'Real-Time Compliance Dashboards',
    description:
      "Get a clear, real-time overview of your compliance status at any moment, helping you stay ahead of potential issues and ensure you’re always audit-ready.",
    image: automatedCompliance,
  },
  {
    title: 'Access Request Management',
    description:
      "Streamline and track access requests and approvals in real-time to prevent unauthorized access and maintain a fully auditable access control process.",
    image: accessRequestModule,
  },
  {
    title: 'Automated User Access Review',
    description:
      "Automate your periodic user access reviews to quickly identify and mitigate any unauthorized or unnecessary access, ensuring compliance and reducing risk.",
    image: userAccessReview,
  },
]


export function PrimaryFeatures() {
  let [tabOrientation, setTabOrientation] = useState('horizontal')

  useEffect(() => {
    let lgMediaQuery = window.matchMedia('(min-width: 1024px)')

    function onMediaQueryChange({ matches }) {
      setTabOrientation(matches ? 'vertical' : 'horizontal')
    }

    onMediaQueryChange(lgMediaQuery)
    lgMediaQuery.addEventListener('change', onMediaQueryChange)

    return () => {
      lgMediaQuery.removeEventListener('change', onMediaQueryChange)
    }
  }, [])

  return (
    <section
      id="features"
      aria-label="Features for running your books"
      className="relative overflow-hidden bg-blue-600 pb-28 pt-20 sm:py-32"
    >
      <img
        className="absolute left-1/2 top-1/2 max-w-none translate-x-[-44%] translate-y-[-42%]"
        src={backgroundImage}
        alt=""
        width={2245}
        height={1636}
        unoptimized
        loading="lazy"  // Lazy load the image
      />
      <Container className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
          All-In-One Solution for Audit and Compliance
          </h2>
          <p className="mt-6 text-lg tracking-tight text-blue-100">
          Everything you need to stay audit-ready – with full transparency and control. Automate your auditing processes, mitigate risks, and track compliance effortlessly, all while ensuring your organization remains aligned with company policies and regulatory requirements
          </p>
        </div>
        <TabGroup
          className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === 'vertical'}
        >
          {({ selectedIndex }) => (
            <>
              <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                <TabList className="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {features.map((feature, featureIndex) => (
                    <div
                      key={feature.title}
                      className={clsx(
                        'group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6',
                        selectedIndex === featureIndex
                          ? ' lg:bg-white/10 lg:ring-1 lg:ring-inset lg:ring-white/10'
                          : 'hover:bg-white/10 lg:hover:bg-white/5',
                      )}
                    >
                      <h3>
                        <Tab
                          className={clsx(
                            'font-display text-lg ui-not-focus-visible:outline-none',
                            selectedIndex === featureIndex
                              ? 'text-blue-600 lg:text-white'
                              : 'text-blue-100 hover:text-white lg:text-white',
                          )}
                        >
                          <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                          {feature.title}
                        </Tab>
                      </h3>
                      <p
                        className={clsx(
                          'mt-2 hidden text-sm lg:block',
                          selectedIndex === featureIndex
                            ? 'text-white'
                            : 'text-blue-100 group-hover:text-white',
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </TabList>
              </div>
              <TabPanels className="lg:col-span-7">
                {features.map((feature) => (
                  <TabPanel key={feature.title} unmount={false}>
                    <div className="relative sm:px-6 lg:hidden">
                      <div className="absolute -inset-x-4 bottom-[-4.25rem] top-[-6.5rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl" />
                      <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">
                        {feature.description}
                      </p>
                    </div>
                    <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                      <img
                        className="w-full"
                        src={feature.image}
                        alt=""
                        priority
                        sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                      />
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </>
          )}
        </TabGroup>
      </Container>
    </section>
  )
}
