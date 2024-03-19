import { defineStore } from 'pinia'
import { getDictionaryListApi } from '@/api/dictionary'
import { store } from '../index'

interface DictionaryState {
  dictionary: Record<string, any>[]
  isInitDictionary: boolean
}

export const useDictionaryStore = defineStore('lock', {
  state: (): DictionaryState => {
    return {
      dictionary: [],
      isInitDictionary: false
    }
  },
  getters: {
    getDictionary(): Record<string, any>[] {
      return this.dictionary
    },
    getIsInitDictionary(): boolean {
      return this.isInitDictionary
    }
  },
  actions: {
    setDictionary(dictionary: Record<string, any>[]) {
      this.dictionary = dictionary
    },
    resetDictionary() {
      this.dictionary = []
    },
    async initDictionary() {
      if (this.getIsInitDictionary) {
        return
      }
      const params = {
        typeCode: ''
      }
      const res = await getDictionaryListApi(params)
      if (res) {
        this.setDictionary(res.data)
        this.setIsIntDictionary(true)
      }
    },
    setIsIntDictionary(isInitDictionary: boolean) {
      this.isInitDictionary = isInitDictionary
    }
  },
  persist: true
})

export const useDictionaryStoreWithOut = () => {
  return useDictionaryStore(store)
}
