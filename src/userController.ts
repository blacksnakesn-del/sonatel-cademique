import type { Request, Response } from "express"

export function createUserController(req: Request, res: Response) :void {
  res.send('Page for creating user!')
}