import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { User, LogOut, Settings, Sparkles } from 'lucide-react'

export const UserProfile = () => {
  const { user, signOut } = useAuth()
  
  const handleSignOut = async () => {
    await signOut()
  }

  if (!user) return null

  return (
    <Card className="bg-card/60 backdrop-blur-xl border-primary/20 shadow-neon">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 border-2 border-primary/20">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-neon-gradient text-black font-semibold">
                {user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">
                {user.user_metadata?.username || 'User'}
              </p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="w-8 h-8 bg-neon-gradient rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-primary/20 hover:bg-primary/5"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="border-primary/20 hover:bg-destructive/20 hover:border-destructive/50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </Card>
  )
}