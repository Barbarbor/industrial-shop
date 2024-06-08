import React from 'react';

const AboutUsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-4">О нас</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Наша цель</h2>
        <p className="text-gray-700">
        Наша цель в IndustroMart — предоставлять нашим клиентам высококачественную промышленную продукцию, помогая им эффективно и результативно достигать своих целей.
        </p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Наша история</h2>
        <p className="text-gray-700">
        Компания IndustroMart, основанная в 2020, уже более 4 лет обслуживает отрасли первоклассными продуктами и услугами. Наше путешествие началось с идеи упростить процесс закупок для предприятий, предлагая широкий спектр продуктов под одной крышей.
        </p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Наша команда</h2>
        <p className="text-gray-700">
        Наша преданная своему делу команда профессионалов стремится предоставить нашим клиентам исключительный сервис и поддержку. От специалистов по продуктам до представителей службы поддержки клиентов — каждый член нашей команды играет решающую роль в нашем успехе.
        </p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Наши продукты</h2>
        <p className="text-gray-700">
        В IndustroMart мы предлагаем широкий ассортимент промышленной продукции, включая машины, оборудование, инструменты, защитное снаряжение и расходные материалы. Занимаетесь ли вы производством, строительством или логистикой, у нас есть решения, отвечающие вашим требованиям. Наша продукция поставляется от проверенных производителей и проходит строгие проверки качества, чтобы гарантировать производительность и надежность.
        </p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Контакты</h2>
        <p className="text-gray-700">
        IndustroMart<br />

          РФ,г. Тула<br />
          пр. Ленина, 92, Тула, Тульская обл.
          <br />
          Телефон: +79999999999<br />
          Email: example.gmail.com<br />
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;