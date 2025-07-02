import { useMutation, useQuery } from 'react-query'

import { fetchWaterings, saveWatering } from '../api/wateringApi'
import { Watering } from '../types/entityTypes'
import useSupabase from './useSupabase'

export const useFetchWaterings = () => {
  const client = useSupabase()
  const queryKey = ['waterings']
  const queryFn = async () => fetchWaterings(client)
  return useQuery({ queryKey, queryFn })
}

export const useSaveWaterings = () => {
  const client = useSupabase()
  const mutationFn = async (watering: Watering) => saveWatering(client, watering)
  return useMutation({ mutationFn })
  /* return useMutation(mutationFn, {
    onMutate: async (watering: Watering) => {
      await queryClient.cancelQueries('waterings');
      const snapshot = queryClient.getQueryData('waterings');
      queryClient.setQueryData('waterings', (old: Watering[] | undefined) => [...(old ? old : []), watering]);

      return { snapshot }
    },
    onError: (err, newWatering, context: any) => {
      queryClient.setQueryData('waterings', context.snapshot)
    },
    onSettled: () => {
      queryClient.invalidateQueries('waterings')
    }
  }); */
}
