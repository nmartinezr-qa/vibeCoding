// Generated manually from the provided schema image.
// public.profile and public.recipe tables only.

export interface Database {
  public: {
    Tables: {
      profile: {
        Row: {
          id: string; // uuid, references auth.users.id
          username: string | null;
          fullname: string | null;
          created_at: string; // timestamptz
          updated_at: string; // timestamptz
        };
        Insert: {
          id: string; // required to match auth.users.id
          username?: string | null;
          fullname?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          fullname?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profile_id_fkey" | string;
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      recipe: {
        Row: {
          id: string; // uuid
          created_at: string; // timestamptz
          user_id: string | null; // uuid, references auth.users.id
          title: string | null;
          description: string | null;
          ingredients: string | null; // could be long text
          coocking_time: number | null; // int4 (typo kept from schema)
          difficulty: string[] | null; // _text indicates text[]
          category: string | null;
          instructions: string[] | null; // _text indicates text[]
          image_url: string | null; // optional public URL to image
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id?: string | null;
          title?: string | null;
          description?: string | null;
          ingredients?: string | null;
          coocking_time?: number | null;
          difficulty?: string[] | null;
          category?: string | null;
          instructions?: string[] | null;
          image_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string | null;
          title?: string | null;
          description?: string | null;
          ingredients?: string | null;
          coocking_time?: number | null;
          difficulty?: string[] | null;
          category?: string | null;
          instructions?: string[] | null;
          image_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "recipe_user_id_fkey" | string;
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profile"]["Row"];
export type Recipe = Database["public"]["Tables"]["recipe"]["Row"];
