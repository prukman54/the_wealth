export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          full_name: string
          phone_number: string
          email: string
          region: string // np, us, eu, uk, ca, au, jp, in
          role: string
        }
        Insert: {
          id?: string
          created_at?: string
          full_name: string
          phone_number: string
          email: string
          region: string
          role?: string
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string
          phone_number?: string
          email?: string
          region?: string
          role?: string
        }
      }
      income: {
        Row: {
          id: string
          created_at: string
          user_id: string
          amount: number
          description: string
          category: string
          date: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          amount: number
          description: string
          category: string
          date: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          amount?: number
          description?: string
          category?: string
          date?: string
        }
      }
      expenses: {
        Row: {
          id: string
          created_at: string
          user_id: string
          amount: number
          description: string
          category: string
          date: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          amount: number
          description: string
          category: string
          date: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          amount?: number
          description?: string
          category?: string
          date?: string
        }
      }
      savings_goals: {
        Row: {
          id: string
          created_at: string
          user_id: string
          name: string
          target_amount: number
          current_amount: number
          target_date: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          name: string
          target_amount: number
          current_amount: number
          target_date: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          name?: string
          target_amount?: number
          current_amount?: number
          target_date?: string
        }
      }
      investments: {
        Row: {
          id: string
          created_at: string
          user_id: string
          name: string
          type: string
          amount: number
          purchase_date: string
          current_value: number
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          name: string
          type: string
          amount: number
          purchase_date: string
          current_value: number
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          name?: string
          type?: string
          amount?: number
          purchase_date?: string
          current_value?: number
        }
      }
      wealth_quotes: {
        Row: {
          id: string
          created_at: string
          quote: string
          author: string
          active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          quote: string
          author: string
          active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          quote?: string
          author?: string
          active?: boolean
        }
      }
    }
  }
}
