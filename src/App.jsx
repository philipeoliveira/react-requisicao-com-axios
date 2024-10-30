import { useEffect, useState } from 'react';
import axios from 'axios';

export default function LastDraw() {
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState(null);
   const [data, setData] = useState(null);
   const [ascOrder, setAscOrder] = useState(false);

   function toggleOrder() {
      ascOrder ? setAscOrder(false) : setAscOrder(true);
   }

   async function fetchData() {
      setIsLoading(true);

      try {
         const response = await axios.get(
            'https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil/'
         );
         setData(response.data);
      } catch (err) {
         console.error('Erro ao buscar os dados na API.', err);
         setError(err);
      } finally {
         setIsLoading(false);
      }
   }

   useEffect(() => {
      fetchData();
   }, []);

   return (
      <section>
         <h2>Último sorteio da Lotofácil</h2>

         {isLoading ? (
            <p>Carregando...</p>
         ) : error ? (
            <div>
               <p>{error.message}</p>
               <p>Não foi possível conectar-se à API da Loterias Caixa.</p>
            </div>
         ) : (
            data && (
               <div key={data.numero}>
                  <p>Data do sorteio: {data.dataApuracao}</p>
                  <div>
                     <p>
                        Concurso: <span>{data.numero}</span>
                     </p>
                     <p>
                        {ascOrder
                           ? data.listaDezenas.join('-')
                           : data.dezenasSorteadasOrdemSorteio.join('-')}
                     </p>
                     <p>
                        <button onClick={toggleOrder}>
                           {ascOrder ? 'Ordem de sorteio' : 'Ordem crescente'}
                        </button>
                     </p>
                  </div>
               </div>
            )
         )}
      </section>
   );
}
