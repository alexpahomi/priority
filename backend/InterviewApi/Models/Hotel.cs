namespace InterviewApi.Models;

public class Hotel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public double Rating { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class HotelData
{
    public List<Hotel> Hotels { get; set; } = new List<Hotel>();
}