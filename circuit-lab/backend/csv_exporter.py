# CSV Waveform Data Exporter Utility
import csv
import io

def generate_simulation_csv(time_series, voltage_channels):
    output = io.StringIO()
    writer = csv.writer(output)
    
    headers = ['Time (s)'] + [f'Channel {i+1}' for i in range(len(voltage_channels))]
    writer.writerow(headers)
    
    for idx, t in enumerate(time_series):
        row = [t] + [ch[idx] if idx < len(ch) else 0.0 for ch in voltage_channels]
        writer.writerow(row)
        
    return output.getvalue()
