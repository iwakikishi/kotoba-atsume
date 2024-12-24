export interface Database {
  public: {
    Tables: {
      children: {
        Row: {
          id: string;
          age: number;
          gender: string;
          created_at: string;
        };
        Insert: {
          age: number;
          gender: string;
          created_at: string;
        };
      };
    };
  };
} 