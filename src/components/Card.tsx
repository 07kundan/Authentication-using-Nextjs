"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import React from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/models/User";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "./ui/use-toast";
import { title } from "process";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

function CardComponent({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();
  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`
    );
    toast: {
      title: "message deleted successfully";
    }

    onMessageDelete(message._id as string);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <X />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default CardComponent;
